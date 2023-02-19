const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');

const { Configuration, OpenAIApi } = require("openai");

// Read the API key from a file
const apiKey = fs.readFileSync('openaiapikey.txt', 'utf8').trim();

const configuration = new Configuration({
    apiKey,
});

const openai = new OpenAIApi(configuration);

router.get('/', async (req, res) => {
    res.render('index', { result: 'New Form' });
});

router.get('/api-call', async (req, res) => {

    const { jobtitle, industry, location, joblevel, companysize } = req.query;
    const prompt = `Create for me a list of required and recommended skills for the role of ${joblevel} ${jobtitle}, in the ${industry} industry for a ${companysize} company located in ${location}.`; // produce the list in JSON format.`;

    // Set up the request parameters for the API call
    const params = {
        model: 'text-davinci-002',
        prompt
        /*max_tokens: 50,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0 */
    };

    console.log(params);

    openai.createCompletion(params)
    .then(response => {
        console.log('API called successfully. Returned data: ');
        console.log(response.data.choices[0].text);
        
        const result = response.data.choices[0].text;
        console.log(result);
    })
    .catch(error => {
        console.error(error);
    });

        /*
      const { jobtitle, industry, location, joblevel, companysize } = req.query;
  
      const prompt = `Create for me a list of required and recommended skills for the role of ${joblevel} ${jobtitle}, in the ${industry} industry for a ${companysize} company located in ${location}. produce the list in JSON format.`;
      const response = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt,
        max_tokens: 50,
        temperature: 0.7,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      console.log(response);

      const result = response.choices[0].text;
  
      res.render('index', { result });
    } catch (error) {
      console.error(error);
      res.render('index', { result: 'Error retrieving data from the API' });
    }

    */
  });

module.exports = router;