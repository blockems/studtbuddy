const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

router.get('/', async (req, res) => {
    res.render('index', { result: 'New Form' });
});

router.get('/api-call', async (req, res) => {

    const { jobtitle, industry, location, joblevel, companysize } = req.query;
    const prompt = `Using a scale of emergent, competent, expert and lead, 
    Can you do a break down of the skills and knowledge required to be rated as competent in the role of a ${jobtitle}.
    Can you put this into a table with the following headings:
    Skill Name, Level, Description
    Place the contents in JSON format. 
    Construct the JSON object so as the name, description and level of the skill are on the base level, with the skills in a skills array. 
    Within the skills array, break each skill down into its sub skills using the same format.`;

    // Set up the request parameters for the API call
    const params = {
        model: 'gpt-3.5-turbo',
        temperature: 0.2,
        messages: [{"role":"user", "content": prompt}]
    };

    openai.createChatCompletion(params)
    .then(response => {
        console.log('API called successfully. Returned data: ');
        console.log(response.data.choices[0].message.content);

        const roleDescription = JSON.parse(response.data.choices[0].message.content, (key, value) => {
            //This is becasue chatgpt sometimes returns capital leters in key names....
            // But only when it feels like it. Bloody AI's, thing they are human or something
            if (typeof key === 'string') {
              return value;
            } else {
              const lowerCaseKey = key.toLowerCase();
              return {[lowerCaseKey]: value};
            }
          });

        res.render('index', {data:roleDescription});
    })
    .catch(error => {
        console.error(error);
    });
  });

module.exports = router;