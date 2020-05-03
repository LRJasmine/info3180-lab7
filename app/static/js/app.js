/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/upload">Upload </router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

const uploadform =Vue.component('upload-form', {
    template: `
    

    <div class="uploads form-group">
    
        <h1>Upload Form</h1>
        
        <div class="alert alert-success" v-if="successdiv">
            <p v-for="each in success">{{ each.message }}</p>
        </div>
        <div class="errormsg alert alert-danger" v-if="errordiv">
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </div>

        <form method="POST" action="" @submit.prevent="uploadPhoto" id="uploadForm">
            <label for="description" class="card-title">Description</label><br>
            <input type="text" id="description" name="description" ><br>
            <label for="photo" class="card-title">Photo</label><br>
            <input type="file" id="photo" name="photo" accept="image/x-png,image/jpg" ><br>
            
            <button type="submit" name="submit" class="btn btn-success">Upload</button>
        </form>
    </div>
    `,
    data: function() {
        return {
            errors: [],
            success: [],
            successdiv: false,
            errordiv: false
        };
    },
    methods: {
        uploadPhoto: function() {
            let self = this;
            
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm); 

            fetch("/api/upload", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin' 
            })
                .then(function (response) {
                    return response.json();
                 })
                .then(function (jsonResponse) {
                    // display a success message
                    if (jsonResponse.errors){
                        self.errordiv= true;
                        self.successdiv = false;
                        self.errors = jsonResponse.errors;
                    } else if (jsonResponse.upload){
                        self.successdiv = true;
                        self.errordiv= false;
                        self.success =jsonResponse.upload;
                    }
                    console.log(jsonResponse); 

                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
   `,
    data: function() {
       return {}
    }
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Home},
        // Put other routes here
        {path: "/upload", component: uploadform},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});