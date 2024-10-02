<template>
  <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #7B5B3A; color: white;">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Capibara World Ticket</a>
      <img alt="Vue logo" :src="require('@/assets/logo.png')" style="width: 60px; height: 50px;">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link v-if="existeUsuario" class="nav-link active" aria-current="page" to="/about">About</router-link>
          </li>
        </ul>
        <form class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-light me-2 text-dark" type="submit">Search</button>
        </form>
        <!-- Log in -->
        <button v-if="!existeUsuario" type="button" class="btn btn-light mx-2 text-dark" data-bs-toggle="modal" data-bs-target="#login">
          Log in
        </button>
        <!-- Log out -->
        <button v-if="existeUsuario" class="btn btn-light me-2 text-dark" @click="signout">
          Log out
        </button>
        <!-- Register -->
        <button v-if="!existeUsuario" type="button" class="btn btn-light text-dark" data-bs-toggle="modal" data-bs-target="#registro">
          Regístrate
        </button>
      </div>
    </div>

    <!-- Login Modal -->
    <div class="modal fade" id="login" tabindex="-1" aria-labelledby="loginLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="loginLabel">Log In</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <input type="email" v-model="email" class="form-control" placeholder="Email">
            <input type="password" v-model="password" class="form-control mt-2" placeholder="Password">
            <div class="text-danger mt-2">{{ errorMessage }}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="login(email, password)">Log In</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Registration Modal -->
    <div class="modal fade" id="registro" tabindex="-1" aria-labelledby="registroLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="registroLabel">Register</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <input type="email" v-model="email" class="form-control" placeholder="Email">
            <input type="password" v-model="password" class="form-control mt-2" placeholder="Password">
            <input type="password" v-model="repassword" class="form-control mt-2" placeholder="Repeat Password">
            <div class="text-danger mt-2">{{ errorMessage }}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="register(email, password)">Register</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { 
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { mapGetters } from 'vuex';

export default {
  name: 'Navbar',
  data() {
    return {
      email: '',
      password: '',
      repassword: '',
      errorMessage: ''
    };
  },
  methods: {
    register(email, password) {
      if (password !== this.repassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          alert('¡Registrado!');
          this.email = '';
          this.password = '';
          this.repassword = '';
          this.errorMessage = '';
        })
        .catch((error) => {
          this.errorMessage = error.message;
          alert(this.errorMessage);
        });
    },
    login(email, password) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          alert('¡Sesión iniciada!');
          this.email = '';
          this.password = '';
          this.errorMessage = '';
        })
        .catch((error) => {
          this.errorMessage = error.message;
          alert(this.errorMessage);
        });
    },
    signout() {
      const auth = getAuth();
      signOut(auth).then(() => {
        alert('¡Sesión cerrada! Inicia sesión.');
      }).catch((error) => {
        alert("Error logging out: " + error.message);
      });
    }
  },
  computed: {
    ...mapGetters(['existeUsuario'])
  }
}
</script>

<style>
/* You can add custom styles here */
</style>
