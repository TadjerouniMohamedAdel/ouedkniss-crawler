#!/usr/bin/env node
const {program} = require('commander')
const { prompt } = require('inquirer')
const  figlet = require('figlet');
const pkg = require("./package.json");
const chalk = require('chalk');
var emoji = require('node-emoji')
const ora = require('ora');
const crawl = require('./crawl.js')

console.log(chalk.red(figlet.textSync("The OuedKniss Crawler")));
console.log(chalk.green(pkg.description)+" "+chalk.yellow(emoji.emojify(":grinning:")));


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
            prompt(questions).then(answers=>{
                crawl(answers.link.trim())
            })
        }    
        else{
            crawl(options.link.trim())

        } 
    })


program.parse(process.argv)
    
