<template>
    <div id="wrapper">
        <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
        <main>
            <!--<button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>-->
            <button class="alt" @click="changeSize">Change Size</button>
            <button class="alt" @click="makeConnection">Make Connection</button>
            <button class="alt" @click="createModel">Create Model</button>
            <button class="alt" @click="createTable">Create Table</button>
            <button class="alt" @click="getProducts">Get Products</button>
            <button class="alt" @click="playAudio">Play Audio</button>
            <button class="alt" @click="openImage">Open Image</button>
            <button class="alt" @click="makeFullScreenWindow">Full Screen</button>
            <button class="alt" @click="makeDefaultScreenWindow">Default Screen</button>
            <button class="alt" @click="openUsb">Open USB</button>
            <button class="alt" @click="useDll">Use C# library</button>
        </main>
        <div class="demo-element" v-html="audioHtml"></div>
        <div v-html="imgHtml"></div>
    </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import store from '../../store/Store'
  import * as db from '../../db/testdb'
  import * as usb from 'usb'
  import * as edge from 'electron-edge-js'
  // let Dll = require('electron-edge-js').func('../../dll/HelloWorld.dll')
  // import * as ffi from 'ffi'

  export default {
    name: 'landing-page',
    components: {SystemInformation},
    data () {
      return {
        imgHtml: '',
        audioHtml: ''
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      changeSize () {
        let width = 100
        let height = 100
        store.set('windowBounds', {width, height})
      },
      makeConnection () {
        db.makeConnection()
      },
      createModel () {
        db.createProductModel()
      },
      createTable () {
        db.createProductTable()
      },
      getProducts () {
        db.listProducts()
      },
      playAudio () {
        // let audio = new Audio('../../media/tada.mp3')
        // audio.play()
        new Audio('src/media/explosion.mp3').play()
        this.$electron.shell.openItem('src/media/explosion.mp3')
        this.audioHtml = `<audio class="demo-element" controls>
            <source src="src/media/explosion.mp3" type="audio/mpeg"/>
        </audio>`
      },
      openImage () {
        this.imgHtml = '<img class="demo-element" src="src/media/cheetah.jpg"/>'
        // this.$electron.shell.openItem('src/media/cheetah.jpg')
        this.$electron.shell.openItem('/media/zaid/data/hi.txt')
      },
      makeFullScreenWindow () {
        this.$electron.remote.getCurrentWindow().setFullScreen(true)
      },
      makeDefaultScreenWindow () {
        this.$electron.remote.getCurrentWindow().setFullScreen(false)
      },
      openUsb () {
        let vid = usb.getDeviceList()[0].deviceDescriptor.idVendor
        let pid = usb.getDeviceList()[0].deviceDescriptor.idProduct
        console.log('Vid', vid)
        console.log('Pid', pid)
        let device = usb.findByIds(vid, pid)
        device.open()
        const deviceInterface = device.interfaces[0]
        let driverAttached = false
        if (deviceInterface.isKernelDriverActive()) {
          driverAttached = true
          deviceInterface.detachKernelDriver()
        }
        console.log(driverAttached)
        deviceInterface.claim()
        // usb.on('attached', (device) => {
        //   console.log('attached', device)
        // })
        // usb.on('detached', (device) => {
        //   console.log('usb detached', device)
        // })
        deviceInterface.release(() => {
          if (driverAttached) {
            deviceInterface.attachKernelDriver()
          }

          device.close()
        })
      },
      useDll () {
        edge.func('../../dll/HelloWorld.dll')
        // Dll.ExecuteQckPlugin()
      }
    }
  }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Source Sans Pro', sans-serif;
    }

    #wrapper {
        background: radial-gradient(
                ellipse at top left,
                rgba(255, 255, 255, 1) 40%,
                rgba(229, 229, 229, .9) 100%
        );
        height: 100vh;
        padding: 60px 80px;
        width: 100vw;
    }

    #logo {
        height: auto;
        margin-bottom: 20px;
        width: 420px;
    }

    main {
        display: flex;
        justify-content: space-between;
    }

    main > div {
        flex-basis: 50%;
    }

    .left-side {
        display: flex;
        flex-direction: column;
    }

    .welcome {
        color: #555;
        font-size: 23px;
        margin-bottom: 10px;
    }

    .title {
        color: #2c3e50;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 6px;
    }

    .title.alt {
        font-size: 18px;
        margin-bottom: 10px;
    }

    p {
        color: black;
        margin-bottom: 10px;
    }

    button {
        font-size: .8em;
        cursor: pointer;
        outline: none;
        padding: 0.75em 2em;
        border-radius: 2em;
        display: inline-block;
        color: #fff;
        background-color: #4fc08d;
        transition: all 0.15s ease;
        box-sizing: border-box;
        border: 1px solid #4fc08d;
    }

    button.alt {
        color: #42b983;
        background-color: transparent;
    }

    .demo-element {
        margin: 2em;
    }

</style>
