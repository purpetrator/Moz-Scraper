# Moz Scraper

#### Overview

Moz Scraper is a web scraper application that crawls and extracts structured data from Moz's blog page. Moz is scraped with Cheerio and Axios, and the data is stored in MongoDB with Mongoose.

> Deployed Link: [See Here](https://doc-portal.herokuapp.com/)

> Repository: [See Here](https://github.com/purpetrator/Project2)

> Moz Blog: [Link](https://moz.com/blog)

#### How to Use

Click the "Scrape Articles" button to get started. This will scrape Moz's blog page and return page elements with the most recent blog posts' information.

![](/public/assets/img/rm1.png)

Each article can be saved. Your saved articles will then appear on the saved page, which can be accessed by clicking the "View Saved" button.

![](/public/assets/img/rm2.png)

Users are able to leave and view comments by clicking the "Comments" button. A modal will appear which will show a comment submission form as well as previous comments on each article. Comments may be deleted by pressing the "x" button near the user's name.

![](/public/assets/img/rm3.png)

## Technologies Used

- MongoDB
- Mongoose
- Express
- Node.js
- JavaScript
- JQuery
- Handlebars.js
- Bootstrap

### Node Packages used:

- Cheerio
- Axios
- Mongoose

## Authors:

- Ana Chernov - Full Stack Web Developer - https://github.com/purpetrator
