axios.defaults.headers.common['Authorization'] = (sessionStorage.getItem("Authorization") == null)?localStorage.getItem("Authorization"):sessionStorage.getItem("Authorization");
axios.defaults.baseURL = "http://106.15.183.161:8080"
axios.interceptors.request.use(
   function (config) {
       $('#loading').show();
       $('#myTabContent').hide();
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
        $('#loading').hide();
        $('#myTabContent').show();
        $('body').css("cursor","default");
        return config;
    },
    function (error) {
        $('body').css("cursor","default");
        return Promise.reject(error);

    }
);
