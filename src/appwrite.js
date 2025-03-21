import {Client, Databases, ID, Query} from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABSE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)

    const database = new Databases(client);

export const updateSearch = async (search, movie) => {
    // 1. Use appwrite SDK to check fi the search term exists in the database.
    try {
        const result = await database.listDocuments(DATABSE_ID, COLLECTION_ID, [
            Query.equal('search', search),
        ])

        // 2. If it does, update the count.
        if (result.documents.length > 0) {
            const doc = result.documents[0];

            await database.updateDocument(DATABSE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            })
        } else {
            // 3. If it doesn't, create a new document with the search term and count as 1.
            await database.createDocument(DATABSE_ID, COLLECTION_ID, ID.unique(), {
                search,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,    
            })
        }
    } catch (error) {
        console.error(error);        
    }

}

export const getTrendingMovies = async () => {    
    try {
        const result = await database.listDocuments(DATABSE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
        ]) 

        return result.documents;
    } catch (error) {
        console.error(error);        
    }
}