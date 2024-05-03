import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ThreeImportService {

  private clickSpaceSubject = new Subject<{toggle: boolean, id: string}>();

  public clickSpace$ = this.clickSpaceSubject.asObservable();

  toggleEdit: boolean = false;
  toggleAddParkingSpace: boolean = false;
  toggleRemoveParkingSpace: boolean = false;


  dragControls?: DragControls;
  scene!: THREE.Scene;
  renderer!: THREE.WebGLRenderer;
  camera!: THREE.PerspectiveCamera;
  controls!: OrbitControls;
  rayCaster?: THREE.Raycaster;
  oriPosition: any[] = [];
  parkingSpaceAddingMode: {id: number,parkinglot: string, position: string, direction: number}[] = [];
  parkingSpaceDetail: any[] = [];

  sizes: { width: number; height: number;} = {width: window.innerWidth, height: innerHeight}

  constructor(private http: HttpClient) { }

  handleClickSpace(toggle: boolean, id: string) {
    this.clickSpaceSubject.next({toggle: toggle, id: id});
  }


  removeParkingSpaceToggled()
  {
    this.toggleRemoveParkingSpace = !this.toggleRemoveParkingSpace;
  }

  reverseToggled()
  {
    let lastObject = this.scene.getObjectById(this.parkingSpaceAddingMode[this.parkingSpaceAddingMode.length-1].id)
    if(lastObject)
      {
        this.scene.remove(lastObject)
        this.parkingSpaceAddingMode.pop()
      }
  }


  AddParkingSpaceToggled() {
    this.toggleAddParkingSpace = !this.toggleAddParkingSpace;
  }

  cancelAddParkingSpace()
  {
    this.AddParkingSpaceToggled()
    this.parkingSpaceAddingMode.forEach(space => {
      let object = this.scene.getObjectById(space.id)
      if(object)
        {
          this.scene.remove(object)
        }
    });
    this.parkingSpaceAddingMode = []
  }
  saveAddParkingSpace()
  {
    this.AddParkingSpaceToggled()
    let data = this.parkingSpaceAddingMode.map((space) => {
      return {ParkingLot: space.parkinglot, position: space.position, direction: space.direction}
    })
    this.http.post('https://ig.example.be:8444/api/admin/spot/', data, {withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}})
      .toPromise()
      .then((response) => {
      console.log(response);
      })
      .catch((error) => {
      console.error(error);
      });

  }

  EditToggled() {
    this.toggleEdit = !this.toggleEdit;
    if(this.dragControls)
      {
        this.dragControls.enabled = this.toggleEdit;
      }
  }
  CancelToggled()
  {
    this.EditToggled()
    this.oriPosition.forEach((model) => {
      this.scene.getObjectByName(model.id)?.
      position.set(model.position.split(',').map(Number)[0], model.position.split(',').map(Number)[1], model.position.split(',').map(Number)[2]);

    })
  }
  CancelEditParkingDetail()
  {
    this.EditToggled()
    this.parkingSpaceDetail.forEach((space) => {
      this.scene.getObjectByName(space.id)?.
      position.set(space.position.split(',').map(Number)[0], space.position.split(',').map(Number)[1], space.position.split(',').map(Number)[2]);
      this.scene.getObjectByName(space.id)?.rotation.set(0, space.direction, 0)
    });
  }

  SaveEditParkingDetail()
  {
    this.EditToggled()
    this.parkingSpaceDetail.forEach((space) => {
      let [x, y, z] = this.scene.getObjectByName(space.id)?.position.toArray().map(String) as string[];
      if(space.position !== `${x},${y},${z}` || space.direction !== this.scene.getObjectByName(space.id)?.rotation.y)
        {
          space.position = `${x},${y},${z}`;
          space.direction = this.scene.getObjectByName(space.id)?.rotation.y;
          this.http.patch('https://ig.example.be:8444/api/admin/spot/'+space.id+'/', space, {withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}})
          .toPromise()
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.error(error);
          });
        }
    })
  }

  SaveToggled()
  {
    this.EditToggled()
    this.oriPosition.forEach((model) => {
      let [x, y, z] = this.scene.getObjectByName(model.id)?.position.toArray().map(String) as string[];
      if(model.position !== `${x},${y},${z}`)
        {
          model.position = `${x},${y},${z}`;
          let data: {id: string, position: string} = {id: model.id, position: model.position}
          this.http.patch('https://ig.example.be:8444/api/admin/parkinglot/'+data.id+'/', data, {withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}})
          .toPromise()
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.error(error);
          });
        }
    })

  }


  public importModel(models: any[]): void {

    const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    this.sceneSetup()

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/three/examples/jsm/libs/draco/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    let parkingmaps:any = [];
    let parkingSpaceDetailPosition:any = [];

    this.cameraSetup()
    this.controlSetup(canvas)
    this.rendererSetup(canvas)


    models.forEach((model) => {
      this.oriPosition.push(model)
      gltfLoader.load(model.model_path.replace('http://app.example.be:8000', 'https://ig.example.be:8444'), (gltf) => {
        gltf.scene.scale.set(0.05, 0.05, 0.05)
        gltf.scene.name = model.id
        this.scene.add(gltf.scene);
        if(models.length > 1)
          {
            let [x, y, z] = model.position.split(',').map(Number);
            gltf.scene.position.set(x,y,z)
            parkingmaps.push(gltf.scene)

          }
          else
          {
            gltf.scene.position.set(0,0,0)
          }
      });
    })
    if(models.length === 1)
      {
        this.addingParkingSpace()
        models[0]['parking_spaces'].forEach((space: any) => {
          this.parkingSpaceDetail.push(space)
          let tempObject = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.01, 0.1),
            new THREE.MeshBasicMaterial()
        );
          tempObject.position.set(space.position.split(',').map(Number)[0], space.position.split(',').map(Number)[1], space.position.split(',').map(Number)[2])
          tempObject.rotation.y = space.direction
          tempObject.name = space.id
          if(space['is_parking'])
            {
              tempObject.material.color.set(0xff0000)
            }
          else if(space['is_charge'])
            {
              tempObject.material.color.set(0x7DF9FF)
            }
          else
            {
              tempObject.material.color.set(0x00ff00)
            }

          this.scene.add(tempObject)
          parkingSpaceDetailPosition.push(tempObject)
        })
        this.enableDragControls(parkingSpaceDetailPosition)

      }
      else
      {
        this.enableDragControls(parkingmaps)
      }



    window.addEventListener('resize', () =>
      {
          this.sizes.width = window.innerWidth
          this.sizes.height = window.innerHeight
          // Update camera
          this.camera.aspect = this.sizes.width /this.sizes.height
          this.camera.updateProjectionMatrix()

          // Update renderer
          this.renderer.setSize(this.sizes.width, this.sizes.height)
          this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      })

    const clock = new THREE.Clock()
    let previousTime = 0
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - previousTime
      previousTime = elapsedTime

      this.controls.update()
      this.renderer.render(this.scene, this.camera)
      window.requestAnimationFrame(tick)
    }
    tick()

  }



  enableDragControls(models: any[])
  {
    this.dragControls = new DragControls(models, this.camera, this.renderer.domElement)
    this.dragControls.transformGroup = this.oriPosition.length > 1 ? true : false
    this.dragControls.enabled = false
    let dragging = false
    let draggedObject: any = null
    this.dragControls.addEventListener('dragstart', (event) => {
      this.controls.enabled = false
      event.object.position.y = 0
      draggedObject = event.object;
    })
    this.dragControls.addEventListener('drag',  (event) => {
      event.object.position.y = 0
      dragging = true
    })

    this.dragControls.addEventListener('dragend',  (event) => {
      event.object.position.y = 0
      dragging = false

      this.controls.enabled = true
    })
    if(this.oriPosition.length === 1)
      {
    document.addEventListener('wheel', (event) => {
        if (dragging && draggedObject) {
          draggedObject.rotation.y += event.deltaY * 0.0002;
          draggedObject.rotation.y %= 2 * Math.PI;
            if (draggedObject.rotation.y < 0) {
              draggedObject.rotation.y += 2 * Math.PI;
            }
        }
      });
    }
  }

  rendererSetup(canvas: any)
  {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas
    })
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  cameraSetup()
  {
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
    this.camera.position.set(0,2,-3)
    this.scene.add(this.camera)
  }
  controlSetup(canvas: any)
  {
    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.target.set(0, 0, 0)
    this.controls.enableZoom = false
  }
  sceneSetup()
  {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xfefefd, 5, 15)
    const envMap = new THREE.CubeTextureLoader().load([
      '/assets/envmap/px.png',
      '/assets/envmap/nx.png',
      '/assets/envmap/py.png',
      '/assets/envmap/ny.png',
      '/assets/envmap/pz.png',
      '/assets/envmap/nz.png',
    ])
   this.scene.background = envMap
    this.scene.environment = envMap
    this.scene.backgroundIntensity = 1.05
  }

  addingParkingSpace()
  {
    let mouseDown = false;
    let mouseMoved = false;
    let tempObject:any = null;
    let mouse  = new THREE.Vector2();
    const rayCaster = new THREE.Raycaster();

    window.addEventListener('click', (event) => {

          if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement ) return;
          let targetElement: Node | null = event.target as Node; // cast event.target to Node

          do {
            if (targetElement instanceof HTMLElement && targetElement.classList.contains('no-click-event')) {
              // This is a click inside the element or its children with class "haha", stop the event
              event.stopPropagation();
              return;
            }
            // Go up the DOM
            targetElement = targetElement?.parentNode || null; // add null check
          } while (targetElement);
          const rect = this.renderer.domElement.getBoundingClientRect();

          // Calculate the mouse position
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
          rayCaster.setFromCamera(mouse, this.camera);
          let intersects = rayCaster.intersectObjects(this.scene.children.filter((child) => child.name !== this.oriPosition[0].id));
          if (intersects.length > 0) {
            if(this.toggleRemoveParkingSpace)
              {
                this.scene.remove(intersects[0].object);
                this.parkingSpaceDetail = this.parkingSpaceDetail.filter((space) => space.id !== intersects[0].object.name)
                this.http.delete('https://ig.example.be:8444/api/admin/spot/'+intersects[0].object.name+'/', {withCredentials:true, headers: {'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] as string}})
                .toPromise()
                .then((response) => {
                  console.log(response);
                })
                .catch((error) => {
                  console.error(error);
                });
             }
             if(!this.toggleEdit && !this.toggleAddParkingSpace && !this.toggleRemoveParkingSpace && !mouseMoved )
             {
              this.handleClickSpace(true, intersects[0].object.name)
              this.camera.position.set(intersects[0].object.position.x, 1, intersects[0].object.position.z)
              this.controls.target.set(intersects[0].object.position.x, 0, intersects[0].object.position.z)
             }
          }
          else if(!this.toggleEdit && !this.toggleAddParkingSpace && !this.toggleRemoveParkingSpace && !mouseMoved )
          {
            this.handleClickSpace(false, '')

            if(!mouseMoved)
              {
                this.controls.target.set(0, 0, 0)
                this.camera.position.set(0, 2, -3)
              }

          }

    });

    window.addEventListener('mousedown', (event) => {
          mouseDown = true;
          mouseMoved = false;

    });
    window.addEventListener('mousemove', (event) => {
      mouseMoved = true;

      if(this.toggleAddParkingSpace)
      {

        const rect = this.renderer.domElement.getBoundingClientRect();

        // Calculate the mouse position
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;


        rayCaster.setFromCamera(mouse, this.camera);
        let intersectPoint = new THREE.Vector3();
        let plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        rayCaster.ray.intersectPlane(plane, intersectPoint);

        if (!tempObject) {
            tempObject = new THREE.Mesh(
              new THREE.BoxGeometry(0.2, 0.01, 0.1),
                new THREE.MeshBasicMaterial({ color: 0xff0000 })
            );
            this.scene.add(tempObject);
        }
        if(!this.scene.getObjectById(tempObject.id) && tempObject)
          {
            this.scene.add(tempObject);
          }


        tempObject.position.set(intersectPoint.x, 0.05, intersectPoint.z);


     }

    });
    window.addEventListener('wheel', (event) => {
      if(this.toggleAddParkingSpace)
      {
        if (tempObject) {
            tempObject.rotation.y += event.deltaY * 0.0002;

            tempObject.rotation.y %= 2 * Math.PI;
            if (tempObject.rotation.y < 0) {
                tempObject.rotation.y += 2 * Math.PI;
            }
        }
      }
  });
  window.addEventListener('mouseup', (event) => {


    if(this.toggleAddParkingSpace)
    {
      if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement) {
        if(this.scene.getObjectById(tempObject.id))
          {
            this.scene.remove(tempObject);
            return;
          }
        else
         {
            this.scene.add(tempObject);
            return;
          }
      }
      if (mouseDown && !mouseMoved) {

          rayCaster.setFromCamera(mouse, this.camera);

          let plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          let intersectPoint = new THREE.Vector3();
          rayCaster.ray.intersectPlane(plane, intersectPoint);

          let modelTesting = new THREE.Mesh(
              new THREE.BoxGeometry(0.2, 0.01, 0.1),
              new THREE.MeshBasicMaterial({ color: 0xff0000 })
          );
          this.scene.add(modelTesting);

          modelTesting.position.set(intersectPoint.x, 0.05, intersectPoint.z);
          modelTesting.rotation.y = tempObject.rotation.y;
          this.parkingSpaceAddingMode.push(
            {
              id: modelTesting.id,
              parkinglot: this.oriPosition[0].id as string,
              position: modelTesting.position.toArray().map(String).join(','),
              direction: tempObject.rotation.y
            }
          )

      }

    }
    mouseDown = false;

  });

  }
}
