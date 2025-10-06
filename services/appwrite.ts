import { Client, Databases, ID, Query, TablesDB } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setDevKey('f501190b9794c806bbffa1e78fc6d2b62b242b13196baa222c1d651d7752f223334cedb70e2717e11467cf182f63452acfe905c8c54b5da3ac5ba9c319d46f7bfb7c7cc832851de907b573fcabd8cdd1e64f7b70a7ebc5f8513cdea952820eedfe639df42127102b19d0af55bac8fefe97bc859dff966d8aa304aceef67d777a')
  .setPlatform('com.MovieFlix.appwrite')

const database = new Databases(client);
const tables = new TablesDB(client);


export const updateSearchCount = async (query: string,movie:Movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm', query)])
    // const result = await tables.listRows({databaseId:DATABASE_ID, tableId:COLLECTION_ID,queries:[Query.equal('searchTerm', query)]})
    
    if (result.documents.length>0) {
        const existingMovie = result.documents[0];

        await database.updateDocument(DATABASE_ID, COLLECTION_ID,existingMovie.$id,{count:existingMovie.count+1})
    }
    else{
        await database.createDocument(DATABASE_ID!,COLLECTION_ID!,ID.unique(),{
            searchTerm: query,
            movie_id:movie.id,
            count:1,
            title:movie.title ,
            poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`
        });

    }
    // console.log(result);
    
    } catch (err) {
        console.log("Error:", err);
        
    }
    
};

export const getTrendingMovies = async ():Promise<TrendingMovie[]|undefined>=>{
    try {
         const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(5), Query.orderDesc('count')])
         return result.documents as unknown as TrendingMovie[];
        
    } catch (error) {
        console.log("Error : ",error);
        return undefined
    }

}