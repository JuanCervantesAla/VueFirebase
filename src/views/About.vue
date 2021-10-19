<template>
  <div class="container">
    <Navbar/>
      <!-- ////////// formulario Añadir ////////// -->
    <!-- Nombre -->
  <div class="container my-4">
  <form>  
    <div class="input-group mb-3">
    <span class="input-group-text">Nombre</span>
    <input v-model="usuario.nombre" type="text" class="form-control">
    </div>
    <!-- Correo -->
    <div class="input-group mb-3">
    <span class="input-group-text">Correo</span>
    <input v-model="usuario.correo" type="text" class="form-control">
    </div>
    <div class="input-group my-3">
     <input type="file" @change="buscarImagen($event)">
    </div>
    <div>
      <img :src="datoImagen">
    </div>
    <!-- Botone Guardar -->
    <div class="mt-3">  
     <button v-show="this.editar === true" 
    @click.prevent="actualizarImagenDatos(id)" 
    class="btn btn-primary">
    Actualizar
  </button>
  <button v-show="this.editar === false" 
    @click.prevent="subirImagenDatos()" 
    class="btn btn-primary">
    Guardar
  </button>
    </div>
  </form>
  </div>
<!-- ////////// tabla ////////// -->
  <table class="table">
    <thead>
      <tr>
        <th scope="col">id</th>
        <th scope="col">Nombre</th>
        <th scope="col">Correo</th>
        <th scope="col">Editar</th>
        <th scope="col">Eliminar</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in usuarios" :key="index">
        <th scope="row">{{index}}</th>
        <td>{{item.nombre}}</td>
        <td>{{item.correo}}</td>
        <td>
          <button @click.prevent="obtenerDatoID( item.id );this.editar = !this.editar;" 
            class="btn btn-primary">Editar
          </button>
        </td> 
        <td>
          <button @click.prevent="eliminarDato(item.id)" 
            class="btn btn-danger">Eliminar
          </button>
         </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { db, storage } from "../main";
import router from '../router/index'

export default {
  name: 'About',
  components: {
    Navbar
  },
  data() {
    return {
      editar: false,
      file: null,
      datoImagen: null,

      usuarios: [],
      
      usuario: {
      nombre: '',
      correo: '',
      id: '',
      foto: ''
      }
    }
  },
  methods: {
    async obtenerDatos () { 
      const querySnapshot = await getDocs(collection(db, "usuarios"));
        querySnapshot.forEach((doc) => {
        let usuario = doc.data()
        usuario.id = doc.id
        this.usuarios.push(usuario)
        console.log(usuario)
      });
    },
    async agregarDato(){
      const docRef = await addDoc(collection(db, "usuarios"), {
        nombre: this.usuario.nombre,
        correo: this.usuario.correo
      })
        .then(() => {
          router.go('/')
          console.log("Documento añadido");
        })
        .catch(function(error) {
          console.error("Error al añadir el documento: ", error);
        });
    },
    // DELETE / ELIMINAR / BORRAR
    async eliminarDato (id){
      await deleteDoc(doc(db, "usuarios", id ));
      router.go('/')
    },
    // GET BY ID / OBTENER POR ID
    async obtenerDatoID (id){
      const docRef = doc(db, "usuarios", id);
      const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            this.usuario = docSnap.data()
            this.usuario.id = docSnap.id
            } 
            else {
            console.log("¡No existe el documento!");
            }
    },

    // BUSCAR IMAGEN
    buscarImagen(event){
        console.log(event.target.files[0]);
        const tipoArchivo = event.target.files[0].type;
        if(tipoArchivo === 'image/jpeg' || tipoArchivo === 'image/png'){
            this.file = event.target.files[0]
            this.error = null
        }
            else{
            this.error = 'Archivo no válido'
            this.file = null
            return 
            }
            const reader = new FileReader();
            reader.readAsDataURL(this.file);
            reader.onload = (e) => {
            this.datoImagen = e.target.result
            console.log(this.datoImagen)
            }
    },
    // SUBIR IMAGEN STORAGE
  async subirImagenDatos(){
    try {
      this.loading = true
// Guarda el nombre del archivo de imagen
      const refImagen = storage.ref().child('imagenes').child(this.file.name)
// Guarda el archivo de la imagen
      const res = await refImagen.put(this.file)
      console.log(res);
 // Descarga / devuelve el enlace a la imagen     
      const urlDescarga = await refImagen.getDownloadURL()
      await 
        addDoc(collection(db, "usuarios"), {
          nombre: this.usuario.nombre,
          correo: this.usuario.correo,
          foto: urlDescarga
        })
        this.error = 'Imagen subida con éxito'
        this.file = null
    } 
      catch (error) {
        console.log(error);
      } 
      finally {
        router.push('/')
        this.loading = false
      }
    },
async actualizarImagenDatos(){
    try {
      this.loading = true
// Guarda el nombre de la imagen
      const refImagen = storage.ref().child('imagenes').child(this.file.name)
// Guarda el archivo de la imagen
      const res = await refImagen.put(this.file)
      console.log(res);
// Descarga el enlace a la imagen
      const urlDescarga = await refImagen.getDownloadURL()
// Actualizar datos en firestore
      const elemento = doc(db, "usuarios", this.usuario.id );
        await updateDoc(elemento, {
          nombre: this.usuario.nombre,
          correo: this.usuario.correo,
          foto: urlDescarga
        })
        this.error = 'Imagen subida con éxito'
        this.file = null
    } 
      catch (error) {
        console.log(error);
        al
      } 
      finally {

        router.push('/')
        this.loading = false
      }
    }


  },
  mounted() {
    this.obtenerDatos();
  },
}
</script>

