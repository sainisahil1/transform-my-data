## How to run
1. Open console in project root
2. Run `npm install`
3. To run using module directly: `npm run start`
4. To run using api end-point: `npm run start:server` and go to `http://localhost:3000/api/users`

## About

Fetch dummy data from https://dummyjson.com/users

Process it in following format:\
{\
[Department]: {\
"male": 1,                      // ---> Male Count Summary\
"female": 1,                    // ---> Female Count Summary\
"ageRange": "XX-XX",            // ---> Range\
"hair": {                       // ---> "Color": Color Summary\
"Black": 1,\
"Blond": 1,\
"Chestnut": 1,\
"Brown": 1\
},\
"addressUser": {                // ---> "firstNamelastName": postalCode\
"TerryMedhurst": "XXXXX",\
}\
}\
},\
...
