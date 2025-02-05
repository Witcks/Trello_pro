let apiROOT = '';

// eslint-disable-next-line no-undef
if (process.env.REACT_APP_BUILD_MODE === 'development') {
    apiROOT = 'http://localhost:8017';
}

// eslint-disable-next-line no-undef
if (process.env.REACT_APP_BUILD_MODE === 'production') {
    apiROOT = 'https://trello-api-e8hg.onrender.com';
}

export const API_ROOT = apiROOT;
