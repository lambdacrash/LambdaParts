# Electronic parts database
## Introduction
This small Node.js application will help you to manage your stock of electronic parts. If you are like me, you have parts in your drawers with no solution to easily answer "Where the **** are these 2N3440 transistors?". So, this application is meant to tell you what you have and where it's stored.

![Demo](https://raw.githubusercontent.com/lambdacrash/LambdaParts/master/animation.gif)

## Features
* wizard helping you to create a new part sheet
* wizard gathering all the information about your parts using Octopart API
  * description
  * brand
  * manufacturer
  * CAD models
  * reference design
  * data sheets
  * picture
* Octopart API integration for information retrieval 
* search engine helping you to find your parts

## Configuration
First of all, you have to get an [Octopart API key](http://octopart.com/api/home). Once you have it, edit the file `config.json` (located in the `PartsDB` folder) and replace `your_key` with your key (line 2).

## Installation
1. clone this repository `git clone https://github.com/lambdacrash/LambdaParts.git lcm` 
2. go into the folder `cd lcm`
3. type `npm install`
4. go into the folder `cd PartsDB`
5. type `node app.js`
6. browse `http://localhost:3000

## License
The content of this project itself is licensed under the
[Creative Commons Attribution 3.0 license](http://creativecommons.org/licenses/by/3.0/us/deed.en_US).
