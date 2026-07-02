import conf from '../conf/conf.js';
import { Client, ID, TablesDB, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    tablesDB;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.tablesDB = new TablesDB(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, tags = [], userId }) {
        try {
            return await this.tablesDB.createRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: slug,
                data: { title, content, featuredImage, status, userId, slug, tags }
            });
        } catch (error) {
            console.log("Appwrite service :: createPost :: error :: ", error);
            return false;
        }
    }

    async updatePost(slug, { title, content, featuredImage, status, tags = [] }) {
        try {
            return await this.tablesDB.updateRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: slug,
                data: { title, content, featuredImage, status, tags }
            });
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error :: ", error);
            return false;
        }
    }

    async deletePost(slug) {
        try {
            await this.tablesDB.deleteRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: slug
            });
            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error :: ", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            const result = await this.tablesDB.listRows({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                queries: [Query.equal('slug', slug)]
            });
            return result.rows[0] ?? null;
        } catch (error) {
            console.log("Appwrite service :: getPost :: error :: ", error);
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        const finalQueries = [...queries, Query.orderDesc("$createdAt")];
        try {
            return await this.tablesDB.listRows({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                queries: finalQueries,
            });
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error :: ", error);
            return false;
        }
    }

    async getUserPosts(userId) {
        try {
            return await this.tablesDB.listRows({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                queries: [Query.equal("userId", userId), Query.orderDesc("$createdAt")],
            });
        } catch (error) {
            console.log("Appwrite service :: getUserPosts :: error :: ", error);
            return false;
        }
    }

    async uploadFile(file) {
        try {
            return await this.bucket.createFile({
                bucketId: conf.appwriteBucketId,
                fileId: ID.unique(),
                file: file
            });
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error :: ", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile({
                bucketId: conf.appwriteBucketId,
                fileId: fileId
            });
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error :: ", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        const url = this.bucket.getFileView({
            bucketId: conf.appwriteBucketId,
            fileId
        });
        return url?.href ?? String(url);
    }
}

const service = new Service();
export default service;