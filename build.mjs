
import fs from "fs"
import path from "path"
const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);

const File = fs.promises

const Folder = {
    async read(folder){
        let files = await File.readdir(folder)
        let justFiles = []
        let upper = files.length
        for(let i = 0; i < upper; i++){
            let f = path.join(folder, files[i])
            let stat = await File.stat(f)
            if(stat.isDirectory()){
                justFiles = justFiles.concat(await Folder.read(f))
            } else {
                justFiles.push(f)
            }
        }
        return justFiles
    },
    async copy(from, to){
        const folders = to.split(path.sep)
        folders.pop()
        let folderpath = "/"
        for(let i = 0; i < folders.length; i++){
            folderpath = path.resolve(folderpath, folders[i])
            try{
                await File.stat(folderpath)
            }catch(e){
                try{await this.create(folderpath)}catch(e){}
            }
        }
        fs.createReadStream(from)
            .pipe(fs.createWriteStream(to))
    },
    async delete(folderpathName){
        let files = await this.read(folderpathName)
        let upper = files.length
        for(let i = 0; i < upper; i++){
            await File.unlink(files[i])
        }
        let folders = await File.readdir(folderpathName)
        let foldersMax = folders.length
        for(let i = 0; i < foldersMax; i++){
            try{
                await File.rmdir(`${folderpathName}/${folders[i]}`)
            }catch(e){console.log(e)}
        }
        await File.rmdir(folderpathName)
    },
    async create(folder){
        await File.mkdir(folder)
    }
}

const SiteGenerator = {
    registerPartial(key, data){
        handlebars.registerPartial(key, data)
    },
    renderPageObject(pathName, text){
        return {
            template: Template.get(path.extname(pathName), text),
            data: text,
            file: Template.transformToHtml(pathName)
        }
    },
    async run(pagesFolder, layoutsFolder){
        let layouts = await Folder.read(layoutsFolder)
        for(let i = 0; i < layouts.length; i++){
            let layoutFileName = layouts[i]
            let data = await File.readFile(layoutFileName, {encoding: "utf8"})
            SiteGenerator.registerPartial(layoutFileName.split(path.sep).pop(), data)
        }
        let pages = await Folder.read(pagesFolder)
        let files = []
        for(let i = 0; i < pages.length; i++){
            try{
                let p = pages[i]
                let file = await File.readFile(p, {encoding: "utf8"})
                let obj = SiteGenerator.renderPageObject(p, file)
                files.push( obj )
            }catch(e){console.error(e)}
        }
        return files
    }
}

const copyFoldersOver = async (folders, destination) =>{
    folders.forEach(async key=>{
        let folder = path.resolve(__dirname, key)
        let files = await Folder.read(folder)
        let root = folder.split(path.sep).pop()
        for await (let file of files) {
            await Folder.copy(file, file.replace(folder, `${destination}${path.sep}${root}`))
        }
    })    
}

;(async ()=>{

    await copyFoldersOver(["src", "lib"], "./docs")

})();