const ParticleImageDisplayer = function(tag_id, canvas_el, params) {
  "use strict";
  this.pImageConfig = {
    particles: {
      array: [],
      density: 80,
      color: '#285CBC',
      size: {
        value: 3,
        random: false,
      },
      movement: {
        speed: 1,
        restless: {
          enabled: false,
          value: 10,
          sync: false
        }
      },
      interactivity: {
        on_hover: {
          enabled: true,
          action: 'repulse'
        },
        on_click: {
          enabled: true,
          action: 'big_repulse'
        },
        on_touch: {
          enabled: true,
          action: 'repulse'
        },
        fn_array: []
      }
    },
    image: {
      src: {
        path: "anime.png",
        is_external: true
      },
      size: {
        canvas_pct: 60,
        min_px: 90,
        max_px: 450
      }
    },
    interactions: {
      repulse: {
        distance: 80,
        strength: 200
      },
      big_repulse: {
        distance: 300,
        strength: 250
      },
      grab: {
        distance: 100,
        line_width: 1,
      }
    },
    canvas: {
      el: canvas_el,
      w: canvas_el.offsetWidth,
      h: canvas_el.offsetHeight
    },
    functions: {
      particles: {},
      image: {},
      canvas: {},
      interactivity: {},
      utils: {}
    },
    mouse: {
      x: null,
      y: null,
      click_x: null,
      click_y: null
    },
  };

  const pImg = this.pImageConfig;
  if (params) {
    Object.deepExtend(pImg, params);
  }

  /*
  ========================================
  =           CANVAS FUNCTIONS           =
  ========================================
  */
  pImg.functions.canvas.init = function() {
    pImg.canvas.context = pImg.canvas.el.getContext('2d');
    pImg.canvas.el.width = pImg.canvas.w;
    pImg.canvas.el.height = pImg.canvas.h;
    pImg.canvas.aspect_ratio = pImg.canvas.w / pImg.canvas.h;
    window.addEventListener('resize', pImg.functions.utils.debounce(pImg.functions.canvas.onResize, 200));
  };

  pImg.functions.canvas.onResize = function() {
    pImg.canvas.w = pImg.canvas.el.offsetWidth;
    pImg.canvas.h = pImg.canvas.el.offsetHeight;
    pImg.canvas.el.width = pImg.canvas.w;
    pImg.canvas.el.height = pImg.canvas.h;
    pImg.canvas.aspect_ratio = pImg.canvas.w / pImg.canvas.h;
    pImg.particles.array = [];
    pImg.functions.image.resize();
    const image_pixels = pImg.functions.canvas.getImagePixels();
    pImg.functions.particles.createImageParticles(image_pixels, true);
  };

  pImg.functions.canvas.clear = function() {
    pImg.canvas.context.clearRect(0, 0, pImg.canvas.w, pImg.canvas.h);
  };

  pImg.functions.canvas.getImagePixels = function() {
    pImg.functions.canvas.clear();
    pImg.canvas.context.drawImage(pImg.image.obj, pImg.image.x, pImg.image.y, pImg.image.obj.width, pImg.image.obj.height);
    const pixel_data = pImg.canvas.context.getImageData(pImg.image.x, pImg.image.y, pImg.image.obj.width, pImg.image.obj.height);
    pImg.functions.canvas.clear();
    return pixel_data;
  };

  /*
  ========================================
  =           IMAGE FUNCTIONS            =
  ========================================
  */
  pImg.functions.image.resize = function() {
    if (pImg.image.aspect_ratio < pImg.canvas.aspect_ratio) {
      // canvas height constrains image size
      pImg.image.obj.height = pImg.functions.utils.clamp(Math.round(pImg.canvas.h * pImg.image.size.canvas_pct / 50), pImg.image.size.min_px, pImg.image.size.max_px);
      pImg.image.obj.width = Math.round(pImg.image.obj.height * pImg.image.aspect_ratio);
    } else {
      // canvas width constrains image size
      pImg.image.obj.width = pImg.functions.utils.clamp(Math.round(pImg.canvas.w * pImg.image.size.canvas_pct / 50), pImg.image.size.min_px, pImg.image.size.max_px);
      pImg.image.obj.height = Math.round(pImg.image.obj.width / pImg.image.aspect_ratio);
    }
    // set x,y coords to center image on canvas
    pImg.image.x = pImg.canvas.w  / 2 - pImg.image.obj.width / 2;
    pImg.image.y = pImg.canvas.h / 2 - pImg.image.obj.height / 2;
  };

  pImg.functions.image.init = function() {
    pImg.image.obj = new Image();
    pImg.image.obj.addEventListener('load', function() {
      // get aspect ratio (only have to compute once on initial load)
      pImg.image.aspect_ratio = pImg.image.obj.width / pImg.image.obj.height;
      pImg.functions.image.resize();
      const img_pixels = pImg.functions.canvas.getImagePixels();
      pImg.functions.particles.createImageParticles(img_pixels);
      pImg.functions.particles.animateParticles();
    });
    pImg.image.obj.src = pImg.image.src.path;
    if (pImg.image.src.is_external) {
      pImg.image.obj.crossOrigin = "anonymous";
    }
  };

  /*
  ========================================
  =          PARTICLE FUNCTIONS          =
  ========================================
  */
  pImg.functions.particles.SingleImageParticle = function(init_xy, dest_xy) {
    this.x = init_xy.x;
    this.y = init_xy.y;
    this.dest_x = dest_xy.x;
    this.dest_y = dest_xy.y;
    this.vx = (Math.random() - 0.5) * pImg.particles.movement.speed;
    this.vy = (Math.random() - 0.5) * pImg.particles.movement.speed;
    this.acc_x = 0;
    this.acc_y = 0;
    this.friction = Math.random() * 0.01 + 0.92;
    this.restlessness = {
      max_displacement: Math.ceil(Math.random() * pImg.particles.movement.restless.value),
      x_jitter: pImg.functions.utils.randIntInRange(-3, 3),
      y_jitter: pImg.functions.utils.randIntInRange(-3, 3),
      on_curr_frame: false
    };
    if (pImg.particles.color instanceof Array) {
      this.color = pImg.particles.color[Math.floor(Math.random() * (pImg.particles.color.length + 1))];
    } else {
      this.color = pImg.particles.color;
    }
    this.radius = Math.round((pImg.particles.size.random ? Math.max(Math.random(), 0.5) : 1) * pImg.particles.size.value);
  };

  pImg.functions.particles.SingleImageParticle.prototype.draw = function() {
    pImg.canvas.context.fillStyle = this.color;
    pImg.canvas.context.beginPath();
    pImg.canvas.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    pImg.canvas.context.fill();
  };

  pImg.functions.particles.createImageParticles = function(pixel_data, at_dest = false) {
    const increment = Math.round(pixel_data.width / pImg.particles.density);
    for (let i = 0; i < pixel_data.width; i += increment) {
      for (let j = 0; j < pixel_data.height; j += increment) {
        if (pixel_data.data[(i + j * pixel_data.width) * 4 + 3] > 128) {
          const dest_xy = {x: pImg.image.x + i, y: pImg.image.y + j};
          const init_xy = at_dest ? dest_xy : {x: Math.random() * pImg.canvas.w, y: Math.random() * pImg.canvas.h};
          pImg.particles.array.push(new pImg.functions.particles.SingleImageParticle(init_xy, dest_xy));
        }
      }
    }
  };

  pImg.functions.particles.updateParticles = function() {
    for (let p of pImg.particles.array) {
      if ((pImg.particles.movement.restless.enabled) && (p.restlessness.on_curr_frame)) {
        // if restless activity is enabled & particle is in restless mode, animate some random movement
        pImg.functions.particles.jitterParticle(p);
      } else {
        // otherwise, update position with approach to destination
        p.acc_x = (p.dest_x - p.x) / 500;
        p.acc_y = (p.dest_y - p.y) / 500;
        p.vx = (p.vx + p.acc_x) * p.friction;
        p.vy = (p.vy + p.acc_y) * p.friction;
        p.x += p.vx;
        p.y += p.vy;
      }

      pImg.functions.interactivity.interactWithClient(p);
    }
  };

  pImg.functions.particles.jitterParticle = function(p) {
    p.x += p.restlessness.x_jitter;
    p.y += p.restlessness.y_jitter;
    if (Math.sqrt((p.dest_x - p.x) ** 2 + (p.dest_y - p.y) ** 2) >= pImg.particles.movement.restless.value) {
      p.restlessness.on_curr_frame = false;
    }
  };

  pImg.functions.particles.animateParticles = function() {
    pImg.functions.canvas.clear()
    pImg.functions.particles.updateParticles();
    for (let p of pImg.particles.array) {
      p.draw();
    }
    requestAnimFrame(pImg.functions.particles.animateParticles);
  };

  /*
  ========================================
  =        INTERACTIVITY FUNCTIONS       =
  ========================================
  */
  pImg.functions.interactivity.repulseParticle = function(p, args) {
    // compute distance to mouse
    const dx_mouse = p.x - pImg.mouse.x,
          dy_mouse = p.y - pImg.mouse.y,
          mouse_dist = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse),
          inv_strength = pImg.functions.utils.clamp(300 - args.strength, 10, 300);
    if (mouse_dist <= args.distance) {
      p.acc_x = (p.x - pImg.mouse.x) / inv_strength;
      p.acc_y = (p.y - pImg.mouse.y) / inv_strength;
      p.vx += p.acc_x;
      p.vy += p.acc_y;
    }
  };

  pImg.functions.interactivity.grabParticle = function(p, args) {
    const dx_mouse = p.x - pImg.mouse.x,
          dy_mouse = p.y - pImg.mouse.y,
          mouse_dist = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);
    if (mouse_dist <= args.distance) {
      pImg.canvas.context.strokeStyle = p.color;
      pImg.canvas.context.lineWidth = Math.min(args.line_width, p.radius * 2);
      pImg.canvas.context.beginPath();
      pImg.canvas.context.moveTo(p.x, p.y);
      pImg.canvas.context.lineTo(pImg.mouse.x, pImg.mouse.y);
      pImg.canvas.context.stroke();
      pImg.canvas.context.closePath();
    }
  };

  pImg.functions.interactivity.onMouseMove = function(func, args, p) {
    if (pImg.mouse.x != null && pImg.mouse.y != null) {
      func(p, args);
    }
  };

  pImg.functions.interactivity.onMouseClick = function(func, args, p) {
    if (pImg.mouse.click_x != null && pImg.mouse.click_y != null) {
      func(p, args);
    }
  };

  pImg.functions.interactivity.addEventListeners = function() {
    if (pImg.particles.interactivity.on_hover.enabled || pImg.particles.interactivity.on_click.enabled) {
      pImg.canvas.el.addEventListener('mousemove', function(e) {
        let pos_x = e.offsetX || e.clientX,
            pos_y = e.offsetY || e.clientY;
        pImg.mouse.x = pos_x;
        pImg.mouse.y = pos_y;
      });
      pImg.canvas.el.addEventListener('mouseleave', function(e) {
        pImg.mouse.x = null;
        pImg.mouse.y = null;
      });
      pImg.functions.utils.addEventActions('on_hover');
    }
    if (pImg.particles.interactivity.on_click.enabled) {
      pImg.canvas.el.addEventListener('mousedown', function(e) {
        pImg.mouse.click_x = pImg.mouse.x;
        pImg.mouse.click_y = pImg.mouse.y;
      });
      pImg.canvas.el.addEventListener('mouseup', function(e) {
        pImg.mouse.click_x = null;
        pImg.mouse.click_y = null;
      });
      pImg.functions.utils.addEventActions('on_click');
    }
    if (pImg.particles.interactivity.on_touch.enabled) {
      pImg.canvas.el.addEventListener('touchmove', function(e) {
        let pos_x = e.touches[0].clientX,
            pos_y = e.touches[0].clientY;
        pImg.mouse.x = pos_x;
        pImg.mouse.y = pos_y;
      });
      pImg.canvas.el.addEventListener('touchend', function(e) {
        pImg.mouse.x = null;
        pImg.mouse.y = null;
      });
      pImg.functions.utils.addEventActions('on_touch');
    }
  };

  pImg.functions.interactivity.interactWithClient = function(p) {
    for (let func of pImg.particles.interactivity.fn_array) {
      func(p);
    }
  };

  /*
  ========================================
  =           UTILS FUNCTIONS            =
  ========================================
  */
  pImg.functions.utils.randIntInRange = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  pImg.functions.utils.clamp = function(n, min, max) {
    return Math.min(Math.max(n, min), max);
  };

  pImg.functions.utils.debounce = function(func, min_interval) {
    let timer;
    return function(event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, min_interval, event);
    };
  };
  
  pImg.functions.utils.addEventActions = function(event) {
    const action_funcs = {
      repulse: pImg.functions.interactivity.repulseParticle,
      big_repulse: pImg.functions.interactivity.repulseParticle,
      grab: pImg.functions.interactivity.grabParticle
    };
    let event_wrapper = event === 'on_click' ? pImg.functions.interactivity.onMouseClick : pImg.functions.interactivity.onMouseMove;
    if (pImg.particles.interactivity[event].enabled) {
      const func = action_funcs[pImg.particles.interactivity[event].action],
            args = pImg.interactions[pImg.particles.interactivity[event].action];
      const partial_func = event_wrapper.bind(null, func, args);
      pImg.particles.interactivity.fn_array.push(partial_func);
    }
  };

  /*
  ========================================
  =           LAUNCH FUNCTIONS           =
  ========================================
  */
  pImg.functions.launch = function() {
    pImg.functions.interactivity.addEventListeners();
    pImg.functions.canvas.init();
    pImg.functions.image.init();
  };

  if (!pImg.disabled) {
    pImg.functions.launch();
  }
};

/*
========================================
=           GLOBAL FUNCTIONS           =
========================================
*/
Object.deepExtend = function(destination, source) {
  // credit: https://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
  for (let property in source) {
    if (source[property] && source[property].constructor &&
     source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      arguments.callee(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};

window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

window.cancelRequestAnimFrame = (function() {
  return window.cancelAnimationFrame         ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame    ||
    window.oCancelRequestAnimationFrame      ||
    window.msCancelRequestAnimationFrame     ||
    clearTimeout
})();

window.pImgDom = [];

window.particleImageDisplay = function(tag_id) {
  // get target element by ID, check for existing canvases
  const pImage_el = document.getElementById(tag_id),
      canvas_classname = 'particle-image-canvas-el',
      existing_canvases = pImage_el.getElementsByClassName(canvas_classname);

  // remove any existing canvases within div
  if (existing_canvases.length) {
    while(existing_canvases.length > 0){
      pImage_el.removeChild(existing_canvases[0]);
    }
  }

  // create canvas element, set size, append to target element
  const canvas_el = document.createElement('canvas');
  canvas_el.className = canvas_classname;
  canvas_el.style.width = "100%";
  canvas_el.style.height = "100%";
  const canvas = document.getElementById(tag_id).appendChild(canvas_el);


  if(canvas != null){
    pImgDom.push(new ParticleImageDisplayer(tag_id, canvas, {}))
    /*
    NOTE: The this chunk normally deals with loading the params.json file. It's disabled for the CodePen demo so you can play with the parameters live by editing the pImageConfig object at the top.
    
    // get params.json filepath from load parameters from element's data-params-src property
    const params_json = pImage_el.dataset.paramsSrc,
      xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json")
    xhr.open("GET", params_json, false);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // parse parameters & launch display
        const params = JSON.parse(xhr.responseText);
        pImgDom.push(new ParticleImageDisplayer(tag_id, canvas, params));
      } else {
        console.log(`failed to load params.json. XMLHTTPRequest status: ${xhr.statusText}`);
      }
    };
    xhr.send();
    */
  }
};

setTimeout(() =>{
  window.particleImageDisplay("particle-image");
 },3100);


// function myFunction(x) {
//   if (x.matches) { // If media query matches
//     const ParticleImageDisplayer = function(tag_id, canvas_el, params) {
//       "use strict";
//       this.pImageConfig = {
//         image: {
//           // src: {
//           //   path: "/anime.png",
//           //   is_external: true
//           // },
//           size: {
//             canvas_pct: 60,
//             min_px: 100,
//             max_px: 300
//           }
//         }
//   }
//     }
//   }
// }
// var x = window.matchMedia("(max-width: 425px)");
// myFunction(x) // Call listener function at run time
// x.addListener(myFunction)