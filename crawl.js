const axios = require('axios')
const cheerio = require('cheerio')
const ora = require('ora');
const chalk = require('chalk');
const url = require('url')
let spinner = ora('start crawling');
var emoji = require('node-emoji')
var validUrl = require('valid-url');


const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'out.csv',
    fieldDelimiter:";",
    header: [
        {id: 'id', title: 'id'},
        {id: 'title', title: 'title'},
        {id: 'date', title: 'date'},
        {id: 'Adresse', title: 'Adresse'},
        {id: 'contacts', title: 'contacts'},
        {id:'description',title:'description'},
    ]
  });
  

const getToNextPage=function(link){
    spinner.start()
    setTimeout(() => {
        spinner.color = 'yellow';
        spinner.text = `link processing: ${link.toString()}`;
    }, 500);
    setTimeout(()=>{
         axios.get(link.toString())
            .then(response=>{
                let $ = cheerio.load(response.data);
                let values = []
                $("div.annonce").each(function(index){
                    let id = $(this).attr('id')
                    if(id)
                    values.push(id.split('ann-')[1])
                })

                

                if(values.length > 0){
                    
                    spinner.color = 'yellow';
                    spinner.text = `crawling the link : ${link.toString()}`;
                       values.map((val)=>{
                           axios.get(`https://www.ouedkniss.com/--------------------------s-d${val}?utm_medium=listing`)
                            .then((response)=>{
                                    let $ = cheerio.load(response.data);
                                    csvWriter.writeRecords([
                                        {
                                            title:$("#Title").text(),
                                            id:val,
                                            date:($("#Description > p:nth-child(3)").text()!="" ? $("#Description > p:nth-child(3)").text()  :$("#Description > p:nth-child(2)").text()).trim(),
                                            Adresse:$(".Adresse").text().trim(),
                                            contacts:`${$(".Email").text()} ${$(".Phone a").attr('href') ? $(".Phone a").attr('href').split("tel:")[1] : ""}`.trim(),
                                            description:$("#Description .description_spacer ~ p ,#Description .description_spacer ~ div").text().trim(),
                                        }
                                    ])
                            })
                            .catch((error)=>{
                                console.log(error)
                            })
                            
                        })
                        let page = link.searchParams.get('p');
                        page = page != undefined && page!="" ? parseInt(page)+1 : 1;
                        link.searchParams.set('p',page) 
                        getToNextPage(link) 
                     
                }
                else spinner.succeed("Crawling finish !, merci")
                //if is not 404
            })
            .catch(error=>{
                spinner.fail(chalk.red(`${error}`))
            })
    },1000)
}




const crawl =  (link)=>{
    if (validUrl.isUri(link)){
            link =  new url.URL(link)
            // console.log(link.host) // must return www.ouedkniss.com
            // console.log(link.protocol) // must return https:

            if(link.host === "www.ouedkniss.com"){
                let page=0;
                page = link.searchParams.get('p');
                page = page != undefined && page!=""  ? parseInt(page) : 1;
                link.searchParams.set('p',page)
                getToNextPage(link)

            }else{
                spinner.fail(chalk.red(`this is not ouedkniss bro ${chalk.yellow(emoji.emojify(":anguished:"))}`))
            }
    }
    else  spinner.fail(chalk.red(`this is not a valid url ${chalk.yellow(emoji.emojify(":anguished:"))}`))
}

module.exports = crawl