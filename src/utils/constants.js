let apiROOT = '';


if (import.meta.env.DEV) {
    apiROOT = 'http://localhost:8017';
}else {
    apiROOT = 'https://trello-api-e8hg.onrender.com';
}


export const API_ROOT = apiROOT;
