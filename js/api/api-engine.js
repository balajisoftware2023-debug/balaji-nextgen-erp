/********************************************************
 BALAJI NEXTGEN ERP
 CENTRAL API ENGINE
 FILE:
 js/api/api-engine.js
********************************************************/

/* =====================================================
GLOBAL ERP API OBJECT
===================================================== */

const ERP_API = {

AUTH : null,

CORE : null,

FRONTEND : null,

WEBSITE : null,

LOADED : false

};

/* =====================================================
MASTER CONTROL SHEET
===================================================== */

const ERP_REGISTRY_URL =
'https://docs.google.com/spreadsheets/d/1FuNJ_XejE2ekYTnk71wXVZ79hRJgu7pmIA6fuE-Iu7I/gviz/tq?tqx=out:json&sheet=API_DEPLOYMENT_REGISTRY';

/* =====================================================
LOAD ERP APIS
===================================================== */

async function loadERPAPI(){

try{

console.log(
'LOADING ERP API REGISTRY...'
);

/* =====================================================
FETCH REGISTRY
===================================================== */

const response =
await fetch(
ERP_REGISTRY_URL
);

const text =
await response.text();

/* =====================================================
PARSE GOOGLE GVIZ
===================================================== */

const json =
JSON.parse(
text.substring(
47,
text.length - 2
)
);

/* =====================================================
GET ROWS
===================================================== */

const rows =
json.table.rows;

/* =====================================================
LOOP ROWS
===================================================== */

rows.forEach(row => {

const APP_NAME =
row.c[0]
?
row.c[0].v
:
'';

const WEBAPP_URL =
row.c[1]
?
row.c[1].v
:
'';

const STATUS =
row.c[3]
?
row.c[3].v
:
'';

/* =====================================================
ONLY ACTIVE
===================================================== */

if(STATUS !== 'ACTIVE'){

return;

}

/* =====================================================
MAP APIS
===================================================== */

if(APP_NAME === 'V2_AUTH'){

ERP_API.AUTH =
WEBAPP_URL;

}

if(APP_NAME === 'V2_CORE'){

ERP_API.CORE =
WEBAPP_URL;

}

if(APP_NAME === 'V2_FRONTEND'){

ERP_API.FRONTEND =
WEBAPP_URL;

}

if(APP_NAME === 'Webside'){

ERP_API.WEBSITE =
WEBAPP_URL;

}

});

/* =====================================================
CHECK
===================================================== */

if(
ERP_API.AUTH
&&
ERP_API.CORE
){

ERP_API.LOADED = true;

console.log(
'AUTH API FOUND:',
ERP_API.AUTH
);

console.log(
'CORE API FOUND:',
ERP_API.CORE
);

}else{

console.log(
'API NOT CONNECTED'
);

}

/* =====================================================
RETURN
===================================================== */

return ERP_API;

}catch(error){

console.log(
'API ENGINE ERROR:',
error
);

return {

status : 'error',

message : 'API ENGINE FAILED'

};

}

}

/* =====================================================
SAFE API CALL
===================================================== */

async function callERPAPI(
url,
payload = {}
){

try{

/* =====================================================
CHECK URL
===================================================== */

if(!url){

return {

status : 'error',

message : 'API URL MISSING'

};

}

/* =====================================================
FETCH API
===================================================== */

const response =
await fetch(url,{

method : 'POST',

mode : 'cors',

headers : {
'Content-Type':'text/plain'
},

body : JSON.stringify(
payload
)

});

/* =====================================================
TEXT RESPONSE
===================================================== */

const text =
await response.text();

console.log(
'API RESPONSE:',
text
);

/* =====================================================
PARSE JSON
===================================================== */

const json =
JSON.parse(text);

return json;

}catch(error){

console.log(
'API CALL ERROR:',
error
);

return {

status : 'error',

message : 'SERVER CONNECTION FAILED',

error : String(error)

};

}

}

/* =====================================================
LOGIN API
===================================================== */

async function loginERP(
loginId,
password
){

try{

/* =====================================================
LOAD APIS
===================================================== */

if(!ERP_API.LOADED){

await loadERPAPI();

}

/* =====================================================
LOGIN CALL
===================================================== */

const result =
await callERPAPI(

ERP_API.AUTH,

{

action : 'LOGIN',

loginId : loginId,

password : password

}

);

/* =====================================================
SUCCESS
===================================================== */

if(
result.data
&&
result.data.status === 'success'
){

/* =====================================================
SAVE SESSION
===================================================== */

localStorage.setItem(

'ERP_USER',

JSON.stringify(
result.data.user
)

);

localStorage.setItem(

'ERP_SESSION',

result.data.sessionToken

);

localStorage.setItem(

'ERP_ROLE',

result.data.user.role

);

console.log(
'LOGIN SUCCESS'
);

/* =====================================================
OPEN DASHBOARD
===================================================== */

window.location.href =
'dashboard.html';

return;

}

/* =====================================================
FAILED
===================================================== */

showMessage(

result.data
?
result.data.message
:
'LOGIN FAILED',

'error'

);

}catch(error){

console.log(
'LOGIN ENGINE ERROR:',
error
);

showMessage(
'SERVER ERROR',
'error'
);

}

}

/* =====================================================
OTP SEND
===================================================== */

async function sendOTP(
mobile
){

try{

if(!ERP_API.LOADED){

await loadERPAPI();

}

const result =
await callERPAPI(

ERP_API.AUTH,

{

action : 'SEND_OTP',

loginId : mobile

}

);

console.log(
'OTP RESULT:',
result
);

if(
result.data
&&
result.data.status === 'success'
){

showMessage(
'OTP SENT SUCCESSFULLY',
'success'
);

}else{

showMessage(
'OTP SEND FAILED',
'error'
);

}

}catch(error){

console.log(error);

showMessage(
'SERVER ERROR',
'error'
);

}

}

/* =====================================================
VERIFY OTP
===================================================== */

async function verifyOTP(
mobile,
otp
){

try{

if(!ERP_API.LOADED){

await loadERPAPI();

}

const result =
await callERPAPI(

ERP_API.AUTH,

{

action : 'VERIFY_OTP',

loginId : mobile,

otp : otp

}

);

console.log(
'VERIFY OTP:',
result
);

if(
result.data
&&
result.data.status === 'success'
){

localStorage.setItem(
'ERP_USER',
JSON.stringify(
result.data.user
)
);

window.location.href =
'dashboard.html';

}else{

showMessage(
'INVALID OTP',
'error'
);

}

}catch(error){

console.log(error);

showMessage(
'SERVER ERROR',
'error'
);

}

}

/* =====================================================
GET USER
===================================================== */

function getERPUser(){

const user =
localStorage.getItem(
'ERP_USER'
);

if(user){

return JSON.parse(user);

}

return null;

}

/* =====================================================
CHECK SESSION
===================================================== */

function checkERPSession(){

const session =
localStorage.getItem(
'ERP_SESSION'
);

if(!session){

window.location.href =
'client-login.html';

}

}

/* =====================================================
LOGOUT
===================================================== */

function logoutERP(){

localStorage.clear();

window.location.href =
'client-login.html';

}

/* =====================================================
AUTO LOAD API
===================================================== */

window.addEventListener(

'load',

async function(){

await loadERPAPI();

}

);