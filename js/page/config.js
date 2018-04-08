axios.defaults.headers.common['Authorization'] = (sessionStorage.getItem("Authorization") == null)?localStorage.getItem("Authorization"):sessionStorage.getItem("Authorization");
axios.defaults.baseURL = "http://localhost:8080";
axios.interceptors.request.use(
   function (config) {
       $('body').css("cursor","wait");
       return config;
   },
    function (error) {
        $('body').css("cursor","default");
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    function (config) {
        $('body').css("cursor","default");
        return config;
    },
    function (error) {
        $('body').css("cursor","default");
        return Promise.reject(error);

    }
);
