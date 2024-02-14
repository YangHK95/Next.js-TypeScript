 import fs from 'fs';
 import path from 'path';
 import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';


 const postsDirectory = path.join(process.cwd(),'posts');

 export function getSortedPostsData(){
    // /posts 파일 이름 잡아주기
    const fileNames = fs.readdirSync(postsDirectory);
    // ['pre-rendering.md', ...]

    const allPostsData = fileNames.map(fileName => {
        const id = fileName.replace(/\.md$/,"");

        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath,'utf-8')

        const matterResult = matter(fileContents)

        return{ 
            id,
            ...matterResult.data as {date: string; title: string}
        }
        //
    })

    // Sorting
    return allPostsData.sort((a,b)=>{
        if(a.date < b.date){
            return 1
        }else{
            return -1
        }
    })
 }

 export function getAllPostIds(){
    const flileNames = fs.readdirSync(postsDirectory)
    return flileNames.map(fileName =>{
        return{
            params:{
                id: fileName.replace(/\.md$/,"")
            }
        }
    })
 }

 export async function getPostData(id:string){
    const fullPath = path.join(postsDirectory,`${id}.md`)
    const fileContents = fs.readFileSync(fullPath,'utf-8')

    const matterResult = matter(fileContents)

    const porcessedContent = await remark().use(remarkHtml).process(matterResult.content)
    const contentHtml = porcessedContent.toString()

    return{
        id,
        contentHtml,
        ...(matterResult.data as {data: string; title: string})
    }
 }