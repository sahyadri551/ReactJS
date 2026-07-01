import { Client, ID, TablesDB, Query } from 'appwrite'
import conf from '../conf/conf.js'

class InteractionService {
    client = new Client()
    tablesDB
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.tablesDB = new TablesDB(this.client)
    }
    async getLikeCount(postId) {
        try {
            const result = await this.tablesDB.listRows({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteLikesTableId,
                queries: [Query.equal('postId', postId)],
            })
            return result.total ?? result.rows.length
        } catch {
            return 0
        }
    }
    async getUserLike(postId, userId) {
        try {
            const result = await this.tablesDB.listRows({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteLikesTableId,
                queries: [
                    Query.equal('postId', postId),
                    Query.equal('userId', userId),
                ],
            })
            return result.rows[0] ?? null
        } catch {
            return null
        }
    }
    async addLike(postId, userId) {
        return await this.tablesDB.createRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteLikesTableId,
            rowId: ID.unique(),
            data: { postId, userId },
        })
    }

    async removeLike(likeRowId) {
        await this.tablesDB.deleteRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteLikesTableId,
            rowId: likeRowId,
        })
    }
    async getComments(postId) {
        try {
            const result = await this.tablesDB.listRows({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCommentsTableId,
                queries: [
                    Query.equal('postId', postId),
                    Query.orderDesc('$createdAt'),
                ],
            })
            return result.rows
        } catch {
            return []
        }
    }

    async addComment({ postId, userId, userName, content }) {
        return await this.tablesDB.createRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCommentsTableId,
            rowId: ID.unique(),
            data: { postId, userId, userName, content },
        })
    }
    async deleteComment(rowId) {
        await this.tablesDB.deleteRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCommentsTableId,
            rowId,
        })
    }
}

const interactionService = new InteractionService()
export default interactionService