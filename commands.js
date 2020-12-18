#!/usr/bin/env node
const {program} = require('commander')
const { prompt } = require('inquirer')

// User Questions
const questions = [
    {
        type:"input",
        name:"link",
        message:"Link of list to crawl :"
    }
]

program
    .version('1.0.0')
    .description("OuedKniss crawler cli")


program
    .command('crawl')
    .alias('cl')
    .option('-l, --link <link>',)
    .description('crowl link of the ouedkniss website')
    .action((options)=>{
        if(!options.link){
            prompt(questions).then(answers=>console.log(answers))
        }
        else console.info(options.link)
    })

program.parse(process.argv)