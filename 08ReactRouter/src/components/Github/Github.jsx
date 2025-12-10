import React from 'react'
import { useLoaderData } from 'react-router-dom';
function Github() {
    // const [data, setData] = useState([]);
    // useEffect(() => {
    //     fetch("https://api.github.com/users/sahyadri551")
    //         .then((res) => res.json())
    //         .then((data) => setData(data));
    // }, []);
    const data = useLoaderData();
    return (
        <div>
            <h1 className='text-center text-3xl font-bold my-5'>Github User Data</h1>
            <div className='text-center'>
                <img src={data.avatar_url} alt="Avatar" className='mx-auto rounded-full w-32 h-32' />
                <h2 className='text-2xl font-bold'>{data.name}</h2>
                <p>{data.bio}</p>
                <p>
                    <strong>Followers:</strong> {data.followers} | <strong>Following:</strong> {data.following} | <strong>Public Repos:</strong> {data.public_repos}
                </p>
            </div>
        </div>
    )
}

export default Github

export const githubLoader = async () => {
    const res = await fetch("https://api.github.com/users/sahyadri551");
    if (!res.ok) {
        throw new Error("Failed to fetch GitHub data");
    }
    const data = await res.json();
    return data;
}
