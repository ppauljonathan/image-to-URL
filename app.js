const {createServer}=require('http');
const {promises}=require('fs');

createServer((req,res)=>{
    const url=req.url;
    const method=req.method.toLowerCase();
    if(url==='/'){
        promises.readFile('./index.html')
        .then(data=>{
            res.end(data.toString());
        })
        .catch(err=>{
            req.emit("error",err);
        })
    }
    else if(url==='/script.js'){
        promises.readFile('./script.js')
        .then(data=>{
            res.end(data.toString());
        })
        .catch(err=>{
            req.emit("error",err);
        })
    }
    else if(url==='/display'){
        promises.readFile('./a.txt')
        .then(url=>{
            res.end(`
                <html>
                <body>
                    <img src="${url}" width="500px" height="auto">
                </body
                </html>
            `)
        })
    }
    else if(url==='/post'&&method==='post'){
        let imageUrl='';
        req.on('processedImageUrl',()=>{
            const updatedUrl=imageUrl
            .split('=')[1]
            .replace(/%3A/g,':')
            .replace(/%2F/g,'/')
            .replace(/%3B/g,';')
            .replace(/%2C/g,',')
            .replace(/%2B/g,'+');
            promises.writeFile('./a.txt',updatedUrl)
            .then(done=>{
                res.writeHead('301',{
                    Location:'/display'
                })
                res.end();
            })
            .catch(err=>{
                req.emit("error",err);
            });
        })
        req.on('data',(ch)=>{
            imageUrl+=ch.toString();
            req.emit('processedImageUrl');
        })
    }
    else{
        res.statusCode=404;
        res.end("E:404 Page Not Found");
    }
    req.on("error",(err)=>{
        res.statusCode=500;
        res.end("E:500 Internal Server Error",err);
    })
})
.listen(8080);