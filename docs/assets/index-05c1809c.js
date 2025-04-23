(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerpolicy&&(i.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?i.credentials="include":o.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();class wt{constructor(e,n,r={},o={}){this.device=e,this.canvas=n,this.items=new Set,this.depthFormat="depth24plus-stencil8",this._pixelRatio=window.devicePixelRatio,this.presentationSize={width:0,height:0},this._sampleCount=1,this.presentationSize.width=this.canvas.clientWidth*this.pixelRatio,this.presentationSize.height=this.canvas.clientHeight*this.pixelRatio,this.canvas.width=this.presentationSize.width,this.canvas.height=this.presentationSize.height,this.ctx=this.canvas.getContext("webgpu"),this.presentationFormat=navigator.gpu.getPreferredCanvasFormat(),this._sampleCount=o.antialias?4:1,this.ctx.configure(Object.assign({device:this.device,format:this.presentationFormat,usage:GPUTextureUsage.RENDER_ATTACHMENT,alphaMode:"premultiplied"},r)),o.antialias&&(this.antialiasRenderTexture=e.createTexture({size:[n.width,n.height],format:this.presentationFormat,sampleCount:this.sampleCount,usage:GPUTextureUsage.RENDER_ATTACHMENT})),this.depthTexture=e.createTexture({size:{width:this.width,height:this.height,depthOrArrayLayers:1},format:this.depthFormat,sampleCount:this.sampleCount,usage:GPUTextureUsage.RENDER_ATTACHMENT}),this.renderPassDescriptor={colorAttachments:[{view:this.colourAttachmentView,resolveTarget:this.colourAttachmentResolveTarget,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this.depthTexture.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store",stencilLoadOp:"clear",stencilStoreOp:"store"}}}get width(){return this.renderTexture?this.renderTexture.width:this.presentationSize.width}get height(){return this.renderTexture?this.renderTexture.height:this.presentationSize.height}get aspectRatio(){return this.width/this.height}get pixelRatio(){return this._pixelRatio}set pixelRatio(e){this._pixelRatio=e,this.resize()}get sampleCount(){return this._sampleCount}set renderTexture(e){var n,r;const o=this.width,i=this.height;(n=this._renderTexture)===null||n===void 0||n.destroy(),this._renderTexture=e,this.setColourAttachment(),(this.width!==o||this.height!==i)&&((r=this.depthTexture)===null||r===void 0||r.destroy(),this.depthTexture=this.device.createTexture({size:{width:this.width,height:this.height,depthOrArrayLayers:1},sampleCount:this.sampleCount,format:this.depthFormat,usage:GPUTextureUsage.RENDER_ATTACHMENT}),this.renderPassDescriptor.depthStencilAttachment.view=this.depthTexture.createView())}get renderTexture(){return this._renderTexture}resize(e,n){var r;if(this.renderTexture)return;const o=(e||this.canvas.clientWidth)*this.pixelRatio,i=(n||this.canvas.clientHeight)*this.pixelRatio;o===this.width&&i===this.height||(this.presentationSize.width=o,this.presentationSize.height=i,this.canvas.width=this.presentationSize.width,this.canvas.height=this.presentationSize.height,(r=this.depthTexture)===null||r===void 0||r.destroy(),this.depthTexture=this.device.createTexture({size:{width:this.width,height:this.height,depthOrArrayLayers:1},format:this.depthFormat,sampleCount:this.sampleCount,usage:GPUTextureUsage.RENDER_ATTACHMENT}),this.renderPassDescriptor.depthStencilAttachment.view=this.depthTexture.createView(),this.antialiasRenderTexture&&(this.antialiasRenderTexture=this.device.createTexture({size:[e,n],format:this.presentationFormat,sampleCount:this.sampleCount,usage:GPUTextureUsage.RENDER_ATTACHMENT})))}add(e){this.items.add(e)}remove(e){this.items.delete(e)}get colourAttachmentView(){return this.antialiasRenderTexture?this.antialiasRenderTexture.createView():this.renderTexture?this.renderTexture.createView():this.ctx.getCurrentTexture().createView()}get colourAttachmentResolveTarget(){if(this.antialiasRenderTexture)return this.renderTexture?this.renderTexture.createView():this.ctx.getCurrentTexture().createView()}setColourAttachment(){this.renderPassDescriptor.colorAttachments[0].view=this.colourAttachmentView,this.renderPassDescriptor.colorAttachments[0].resolveTarget=this.colourAttachmentResolveTarget}render(e){this.setColourAttachment();const n=this.device.createCommandEncoder(),r=n.beginRenderPass(this.renderPassDescriptor);Array.isArray(e)?e.forEach(i=>i.getCommands(r)):e.getCommands(r),r.end();const o=n.finish();this.device.queue.submit([o])}renderAll(){this.setColourAttachment();const e=this.device.createCommandEncoder(),n=e.beginRenderPass(this.renderPassDescriptor);for(const o of this.items)o.getCommands(n);n.end();const r=e.finish();this.device.queue.submit([r])}}class Tt{constructor(e){this.device=e,this.items=new Set}add(e){this.items.add(e)}remove(e){this.items.delete(e)}run(e){const n=this.device.createCommandEncoder(),r=n.beginComputePass();Array.isArray(e)?e.forEach(i=>i.getCommands(r)):e.getCommands(r),r.end();const o=n.finish();this.device.queue.submit([o])}runAll(){const e=this.device.createCommandEncoder(),n=e.beginComputePass();for(const o of this.items)o.getCommands(n);n.end();const r=e.finish();this.device.queue.submit([r])}}class Xe{get inputs(){return this._inputs}set inputs(e){this._inputs=e,this.inputsKeys=Object.keys(this.inputs)}getInput(e){return this.inputs[e]}setInput(e,n){this._inputs[e]=n,this.inputsKeys=Object.keys(this.inputs)}getBindGroupLayouts(){return this.inputsKeys.map(e=>this.inputs[e].bindGroupLayout)}setBindGroups(e){this.inputsKeys.forEach((n,r)=>{this.inputs[n].update&&this.inputs[n].update(),e.setBindGroup(r,this.inputs[n].bindGroup)})}getWgslChunk(){return this.inputsKeys.reduce((e,n)=>`${e} ${this.inputs[n].getWgslChunk(this.inputsKeys.indexOf(n),n)}`,"")}}class At extends Xe{constructor(e,n,r,o,i={}){super(),this.renderer=e,this.shader=n,this.geometry=r,this._inputs=o,i=Object.assign({wireframe:!1,depthWrite:!0,depthCompare:"less"},i),this.inputsKeys=Object.keys(this.inputs);const s=e.device.createShaderModule({code:this.shader}),c=this.geometry.getVertexState(s),f=this.getFragmentState(s),a=e.device.createPipelineLayout({bindGroupLayouts:this.getBindGroupLayouts()});this.pipeline=e.device.createRenderPipeline({layout:a,vertex:c,fragment:f,primitive:{topology:i.wireframe?"line-list":"triangle-list"},depthStencil:{format:e.depthFormat,depthWriteEnabled:i.depthWrite,depthCompare:i.depthCompare},multisample:e.sampleCount===4?{count:e.sampleCount,alphaToCoverageEnabled:!0}:void 0})}get inputs(){return this._inputs}getFragmentState(e){return{module:e,entryPoint:"fragment_main",targets:[{format:this.renderer.presentationFormat,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"}}}]}}setBindGroups(e){super.setBindGroups(e)}getCommands(e){e.setPipeline(this.pipeline),this.geometry.setVertexBuffers(e),this.setBindGroups(e),e.drawIndexed(this.geometry.vertexCount,this.geometry.instanceCount,0,0)}}class D extends Xe{constructor(e,n,r,o,i){super(),this.device=e,this.shader=n,this._inputs=r,this.count=o,this.workgroupSize=i,this.inputsKeys=Object.keys(this.inputs);const s=this.device.createShaderModule({code:this.shader}),c=this.device.createPipelineLayout({bindGroupLayouts:this.getBindGroupLayouts()});this.pipeline=this.device.createComputePipeline({layout:c,compute:{module:s,entryPoint:"main"}})}setBindGroups(e){super.setBindGroups(e)}getCommands(e){e.setPipeline(this.pipeline),this.setBindGroups(e),e.dispatchWorkgroups(Math.ceil(this.count/this.workgroupSize))}}class Et{constructor(e,{indices:n,normal:r,position:o,texcoord:i},s=1){this.instanceCount=s,this._vertexCount=n==null?void 0:n.length,this.positionBuffer=e.device.createBuffer({size:o.length*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0}),new Float32Array(this.positionBuffer.getMappedRange()).set(o),this.positionBuffer.unmap(),this.normalBuffer=e.device.createBuffer({size:r.length*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0}),new Float32Array(this.normalBuffer.getMappedRange()).set(r),this.normalBuffer.unmap(),this.texCoordBuffer=e.device.createBuffer({size:i.length*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0}),new Float32Array(this.texCoordBuffer.getMappedRange()).set(i),this.texCoordBuffer.unmap(),this.indicesBuffer=e.device.createBuffer({size:n.length*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.INDEX,mappedAtCreation:!0}),new Uint16Array(this.indicesBuffer.getMappedRange()).set(n),this.indicesBuffer.unmap()}get vertexCount(){return this._vertexCount}getVertexState(e){return{module:e,entryPoint:"vertex_main",buffers:[{arrayStride:3*Float32Array.BYTES_PER_ELEMENT,stepMode:"vertex",attributes:[{format:"float32x3",offset:0,shaderLocation:0}]},{arrayStride:3*Float32Array.BYTES_PER_ELEMENT,stepMode:"vertex",attributes:[{format:"float32x3",offset:0,shaderLocation:1}]},{arrayStride:2*Float32Array.BYTES_PER_ELEMENT,stepMode:"vertex",attributes:[{format:"float32x2",offset:0,shaderLocation:2}]}]}}setVertexBuffers(e){e.setIndexBuffer(this.indicesBuffer,"uint16"),e.setVertexBuffer(0,this.positionBuffer),e.setVertexBuffer(1,this.normalBuffer),e.setVertexBuffer(2,this.texCoordBuffer)}}class j extends Float32Array{static calculatePadding(e,n){const r=4-e%4;if(r===4)return 0;if(n==null)return r;if(Array.isArray(n))switch(r){case 1:return 1;case 2:{if(n.length>2)return 2;break}case 3:return n.length===2?1:3}return 0}static inferMemberType(e){const n=[];if(e.isArray)e.length<=4&&n.push(`vec${e.length}<f32>`),e.length==4&&n.push("mat2x2<f32>"),e.length==6&&(n.push("mat2x3<f32>"),n.push("mat3x2<f32>")),e.length==8&&(n.push("mat2x4<f32>"),n.push("mat4x2<f32>")),e.length==9&&n.push("mat3x3<f32>"),e.length==12&&(n.push("mat3x4<f32>"),n.push("mat4x3<f32>")),e.length==16&&n.push("mat4x4<f32>"),n.push("array<T, N>");else return"f32";return`[${n.join(" OR ")}]`}constructor(e,n=1){const r=[],o={};let i=0,s=e,c;typeof s!="function"&&(c=[...Object.entries(s)]);for(let f=0;f<n;f++){typeof s=="function"&&(c=[...Object.entries(s(f))]);for(let a=0;a<c.length;a++){const u=c[a],h=u[0];let l=u[1],p=r.length;l=l instanceof Function?l():l,l=l instanceof Float32Array?Array.from(l):l,f===0&&(o[h]={index:p,length:Array.isArray(l)?l.length:1,isArray:Array.isArray(l)}),Array.isArray(l)?r.push(...l):r.push(l);let m=c[a+1]?c[a+1][1]:c[0][1];m&&(m=m instanceof Function?m():m,m=m instanceof Float32Array?Array.from(m):m);const d=j.calculatePadding(r.length,m);for(let _=0;_<d;_++)r.push(0)}f===0&&(i=r.length)}super(r),this.count=n,this.metadata={},this._stride=0,this.metadata=o,this._stride=i}get stride(){return this._stride}getValueAt(e,n=0){const{index:r,length:o}=this.metadata[e];return o>1?Array.from(new Float32Array(this.buffer).slice(r+n*this.stride,r+n*this.stride+o)):this[r+n*this.stride]}setValueAt(e,n,r=0,o=0){const{index:i}=this.metadata[e];n instanceof Float32Array&&(n=Array.from(n)),Array.isArray(n)?this.set(n,i+o+r*this.stride):this.set([n],i+o+r*this.stride)}getWgslChunk(e="MyStruct"){const n=Object.entries(this.metadata);return`
    struct ${e} {
        ${n.reduce((r,[o,i])=>r===""?`${o} : ${j.inferMemberType(i)},`:`${r}
        ${o} : ${j.inferMemberType(i)},`,"")}
    }`}}class Bt{constructor(e,n){this.device=e,this.bufferMembers=[],this.textures=[],this.bufferNeedsUpdate=!0,this.autoUpdate=!0;for(let o in n){const i=n[o];i instanceof GPUTexture?this.textures.push({key:o,value:i}):this.bufferMembers.push({key:o,value:i})}this.createArraysAndBuffers(),this.createBindGroup();const r={get:(o,i)=>this.proxyGetHandler(o,i),set:(o,i,s)=>this.proxySetHandler(o,i,s)};this._member=new Proxy({},r)}createArraysAndBuffers(){const e=this.bufferMembers.reduce((n,r)=>(n[r.key]=r.value,n),{});this._uniformsArray=new j(e),this.uniformsBuffer=this.device.createBuffer({size:this._uniformsArray.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.update()}createBindGroup(){const e=[];this.bufferMembers.length&&e.push({binding:e.length,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT|GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}),this.textures.forEach(({value:r})=>{e.push({binding:e.length,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT|GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}),e.push({binding:e.length,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT|GPUShaderStage.COMPUTE,texture:{sampleType:"float",multisampled:!1,viewDimension:r.dimension}})}),this._bindGroupLayout=this.device.createBindGroupLayout({entries:e});const n=[];this.bufferMembers.length&&n.push({binding:0,resource:{buffer:this.uniformsBuffer}}),this.textures.forEach(({value:r})=>{n.push({binding:n.length,resource:this.device.createSampler({magFilter:"linear",minFilter:"linear"})}),n.push({binding:n.length,resource:r.createView({dimension:r.dimension})})}),this._bindGroup=this.device.createBindGroup({layout:this.bindGroupLayout,entries:n})}proxyGetHandler(e,n){const r=this.textures.find(({key:o})=>o===n);return r?r.value:this._uniformsArray.getValueAt(n)}proxySetHandler(e,n,r){if(r instanceof GPUTexture){const o=this.textures.find(({key:i})=>i===n);o.value=r,this.createBindGroup()}else this._uniformsArray.setValueAt(n,r),this.bufferNeedsUpdate=!0;return this.autoUpdate&&this.update(),!0}get uniformsArray(){return this._uniformsArray}get member(){return this._member}get bindGroupLayout(){return this._bindGroupLayout}get bindGroup(){return this._bindGroup}getWgslChunk(e="[REPLACE_WITH_GROUP_INDEX]",n=""){const r=`Uniforms${n.charAt(0).toUpperCase()+n.slice(1)}`;return`
    ${this._uniformsArray.getWgslChunk(r)}

    @group(${e}) @binding(0) var<uniform> uniforms${n?"_":""}${n} : ${r};

    ${this.textures.map((o,i)=>`
      @group(${e}) @binding(${i*2+1}) var sampler_2d_${i}: sampler;
      @group(${e}) @binding(${i*2+2}) var texture_${i}: texture_2d<f32>;
    `).join(`
`)}
    `}update(){this.bufferNeedsUpdate&&(this.device.queue.writeBuffer(this.uniformsBuffer,0,this._uniformsArray),this.bufferNeedsUpdate=!1)}}globalThis&&globalThis.__awaiter;var Ct=globalThis&&globalThis.__awaiter||function(t,e,n,r){function o(i){return i instanceof n?i:new n(function(s){s(i)})}return new(n||(n=Promise))(function(i,s){function c(u){try{a(r.next(u))}catch(h){s(h)}}function f(u){try{a(r.throw(u))}catch(h){s(h)}}function a(u){u.done?i(u.value):o(u.value).then(c,f)}a((r=r.apply(t,e||[])).next())})};class St{constructor(e,n){this.device=e,this.data=n,this.bindGroupSwapIndex=0,this.isReadingStagingBuffer=!1;const r=n.byteLength;this.bufferA=this.device.createBuffer({size:r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC,mappedAtCreation:!0}),new Float32Array(this.bufferA.getMappedRange()).set([...n]),this.bufferA.unmap(),this.bufferB=this.device.createBuffer({size:r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC,mappedAtCreation:!0}),new Float32Array(this.bufferB.getMappedRange()).set([...n]),this.bufferB.unmap(),this.stagingBuffer=this.device.createBuffer({size:r,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this._bindGroupLayout=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE|GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),this.bindGroupA=this.device.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.bufferA}},{binding:1,resource:{buffer:this.bufferB}}]}),this.bindGroupB=this.device.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.bufferB}},{binding:1,resource:{buffer:this.bufferA}}]})}get length(){return this.data.length}get byteLength(){return this.data.byteLength}get bindGroupLayout(){return this._bindGroupLayout}get bindGroup(){return this.bindGroupSwapIndex%2===0?this.bindGroupA:this.bindGroupB}get buffer(){return this.bindGroupSwapIndex%2===0?this.bufferA:this.bufferB}get backBuffer(){return this.bindGroupSwapIndex%2===1?this.bufferA:this.bufferB}step(){this.bindGroupSwapIndex++}getWgslChunk(e="[REPLACE_WITH_GROUP_INDEX]",n=""){if(this.data instanceof j){const r=`PingPong${n.charAt(0).toUpperCase()+n.slice(1)}`;return`
      ${this.data.getWgslChunk(r)}
  
    @group(${e}) @binding(0) var<storage, read> input${n?"_":""}${n} : array<${r}>;
    @group(${e}) @binding(1) var<storage, read_write> output${n?"_":""}${n} : array<${r}>;
      `}else return`
    @group(${e}) @binding(0) var<storage, read> input${n?"_":""}${n} : array<[REPLACE_WITH_TYPE]>;
    @group(${e}) @binding(1) var<storage, read_write> output${n?"_":""}${n} : array<[REPLACE_WITH_TYPE]>;
      `}read(){return Ct(this,void 0,void 0,function*(){if(this.isReadingStagingBuffer)return null;this.isReadingStagingBuffer=!0;const e=this.device.createCommandEncoder();e.copyBufferToBuffer(this.buffer,0,this.stagingBuffer,0,this.stagingBuffer.size),this.device.queue.submit([e.finish()]),yield this.stagingBuffer.mapAsync(GPUMapMode.READ,0,this.stagingBuffer.size);const r=this.stagingBuffer.getMappedRange(0,this.stagingBuffer.size).slice(0);return this.stagingBuffer.unmap(),this.isReadingStagingBuffer=!1,new Float32Array(r)})}}class Pt{constructor(){this.then=Date.now(),this.delta=16.666,this.correction=1,this.elapsedTime=0,this.reset=this.reset.bind(this),window.addEventListener("blur",this.reset),window.addEventListener("focus",this.reset)}reset(){this.then=Date.now(),this.elapsedTime=0,this.correction=1,this.delta=16.66}tick(){const e=Date.now();return typeof this.then=="number"&&(this.delta=Math.min(e-this.then,16.666*5)),this.elapsedTime+=this.delta,this.then=e,this.correction=this.delta/16.666,{delta:this.delta,correction:this.correction,elapsedTime:this.elapsedTime}}}var Oe=typeof Float32Array<"u"?Float32Array:Array;Math.hypot||(Math.hypot=function(){for(var t=0,e=arguments.length;e--;)t+=arguments[e]*arguments[e];return Math.sqrt(t)});function ee(){var t=new Oe(2);return Oe!=Float32Array&&(t[0]=0,t[1]=0),t}function de(t,e,n){return t[0]=e,t[1]=n,t}function Ut(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t}(function(){var t=ee();return function(e,n,r,o,i,s){var c,f;for(n||(n=2),r||(r=0),o?f=Math.min(o*n+r,e.length):f=e.length,c=r;c<f;c+=n)t[0]=e[c],t[1]=e[c+1],i(t,t,s),e[c]=t[0],e[c+1]=t[1];return e}})();globalThis&&globalThis.__awaiter;var Gt=globalThis&&globalThis.__awaiter||function(t,e,n,r){function o(i){return i instanceof n?i:new n(function(s){s(i)})}return new(n||(n=Promise))(function(i,s){function c(u){try{a(r.next(u))}catch(h){s(h)}}function f(u){try{a(r.throw(u))}catch(h){s(h)}}function a(u){u.done?i(u.value):o(u.value).then(c,f)}a((r=r.apply(t,e||[])).next())})};const Ft=()=>Gt(void 0,void 0,void 0,function*(){if(!navigator.gpu){const e="WebGPU not available! — Use Chrome Canary and enable-unsafe-gpu in flags.";return console.error(e),alert(e),!1}const t=yield navigator.gpu.requestAdapter();return t?yield t.requestDevice():(console.warn("Could not access Adapter"),!1)}),Rt={requestWebGPU:Ft};/* @license twgl.js 5.3.0 Copyright (c) 2015, Gregg Tavares All Rights Reserved.
Available via the MIT license.
see: http://github.com/greggman/twgl.js for details */let pe=Float32Array;function me(t,e,n){const r=new pe(3);return t&&(r[0]=t),e&&(r[1]=e),n&&(r[2]=n),r}function $t(t,e,n){return n=n||new pe(3),n[0]=t[0]+e[0],n[1]=t[1]+e[1],n[2]=t[2]+e[2],n}function Vt(t,e,n){return n=n||new pe(3),n[0]=t[0]*e[0],n[1]=t[1]*e[1],n[2]=t[2]*e[2],n}let qe=Float32Array;function Mt(t){return t=t||new qe(16),t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function It(t,e){e=e||new qe(16);const n=t[0*4+0],r=t[0*4+1],o=t[0*4+2],i=t[0*4+3],s=t[1*4+0],c=t[1*4+1],f=t[1*4+2],a=t[1*4+3],u=t[2*4+0],h=t[2*4+1],l=t[2*4+2],p=t[2*4+3],m=t[3*4+0],d=t[3*4+1],_=t[3*4+2],x=t[3*4+3],v=l*x,w=_*p,T=f*x,g=_*a,b=f*p,B=l*a,A=o*x,E=_*i,S=o*p,P=l*i,L=o*a,G=f*i,k=u*d,H=m*h,W=s*d,X=m*c,q=s*h,K=u*c,te=n*d,ne=m*r,re=n*h,oe=u*r,ie=n*c,se=s*r,Ne=v*c+g*h+b*d-(w*c+T*h+B*d),Le=w*r+A*h+P*d-(v*r+E*h+S*d),De=T*r+E*c+L*d-(g*r+A*c+G*d),ze=B*r+S*c+G*h-(b*r+P*c+L*h),C=1/(n*Ne+s*Le+u*De+m*ze);return e[0]=C*Ne,e[1]=C*Le,e[2]=C*De,e[3]=C*ze,e[4]=C*(w*s+T*u+B*m-(v*s+g*u+b*m)),e[5]=C*(v*n+E*u+S*m-(w*n+A*u+P*m)),e[6]=C*(g*n+A*s+G*m-(T*n+E*s+L*m)),e[7]=C*(b*n+P*s+L*u-(B*n+S*s+G*u)),e[8]=C*(k*a+X*p+q*x-(H*a+W*p+K*x)),e[9]=C*(H*i+te*p+oe*x-(k*i+ne*p+re*x)),e[10]=C*(W*i+ne*a+ie*x-(X*i+te*a+se*x)),e[11]=C*(K*i+re*a+se*p-(q*i+oe*a+ie*p)),e[12]=C*(W*l+K*_+H*f-(q*_+k*f+X*l)),e[13]=C*(re*_+k*o+ne*l-(te*l+oe*_+H*o)),e[14]=C*(te*f+se*_+X*o-(ie*_+W*o+ne*f)),e[15]=C*(ie*l+q*o+oe*f-(re*f+se*l+K*o)),e}function Nt(t,e,n){n=n||me();const r=e[0],o=e[1],i=e[2],s=r*t[0*4+3]+o*t[1*4+3]+i*t[2*4+3]+t[3*4+3];return n[0]=(r*t[0*4+0]+o*t[1*4+0]+i*t[2*4+0]+t[3*4+0])/s,n[1]=(r*t[0*4+1]+o*t[1*4+1]+i*t[2*4+1]+t[3*4+1])/s,n[2]=(r*t[0*4+2]+o*t[1*4+2]+i*t[2*4+2]+t[3*4+2])/s,n}function Lt(t,e,n){n=n||me();const r=e[0],o=e[1],i=e[2];return n[0]=r*t[0*4+0]+o*t[1*4+0]+i*t[2*4+0],n[1]=r*t[0*4+1]+o*t[1*4+1]+i*t[2*4+1],n[2]=r*t[0*4+2]+o*t[1*4+2]+i*t[2*4+2],n}const _e=5120,J=5121,ge=5122,ye=5123,xe=5124,ve=5125,be=5126,Dt=32819,zt=32820,Ot=33635,kt=5131,Yt=33640,jt=35899,Ht=35902,Wt=36269,Xt=34042,Ke={};{const t=Ke;t[_e]=Int8Array,t[J]=Uint8Array,t[ge]=Int16Array,t[ye]=Uint16Array,t[xe]=Int32Array,t[ve]=Uint32Array,t[be]=Float32Array,t[Dt]=Uint16Array,t[zt]=Uint16Array,t[Ot]=Uint16Array,t[kt]=Uint16Array,t[Yt]=Uint32Array,t[jt]=Uint32Array,t[Ht]=Uint32Array,t[Wt]=Uint32Array,t[Xt]=Uint32Array}function we(t){if(t instanceof Int8Array)return _e;if(t instanceof Uint8Array||t instanceof Uint8ClampedArray)return J;if(t instanceof Int16Array)return ge;if(t instanceof Uint16Array)return ye;if(t instanceof Int32Array)return xe;if(t instanceof Uint32Array)return ve;if(t instanceof Float32Array)return be;throw new Error("unsupported typed array type")}function Qe(t){if(t===Int8Array)return _e;if(t===Uint8Array||t===Uint8ClampedArray)return J;if(t===Int16Array)return ge;if(t===Uint16Array)return ye;if(t===Int32Array)return xe;if(t===Uint32Array)return ve;if(t===Float32Array)return be;throw new Error("unsupported typed array type")}function qt(t){const e=Ke[t];if(!e)throw new Error("unknown gl type");return e}const ae=typeof SharedArrayBuffer<"u"?function(e){return e&&e.buffer&&(e.buffer instanceof ArrayBuffer||e.buffer instanceof SharedArrayBuffer)}:function(e){return e&&e.buffer&&e.buffer instanceof ArrayBuffer};function Kt(t,e,n){t.forEach(function(r){const o=e[r];o!==void 0&&(n[r]=o)})}const ke=new Map;function Qt(t,e){if(!t||typeof t!="object")return!1;let n=ke.get(e);n||(n=new WeakMap,ke.set(e,n));let r=n.get(t);if(r===void 0){const o=Object.prototype.toString.call(t);r=o.substring(8,o.length-1)===e,n.set(t,r)}return r}function Zt(t,e){return typeof WebGLBuffer<"u"&&Qt(e,"WebGLBuffer")}const Ze=35044,O=34962,Je=34963,Jt=34660,en=5120,tn=5121,nn=5122,rn=5123,on=5124,sn=5125,et=5126,tt={attribPrefix:""};function cn(t,e,n,r,o){t.bindBuffer(e,n),t.bufferData(e,r,o||Ze)}function Te(t,e,n,r){if(Zt(t,e))return e;n=n||O;const o=t.createBuffer();return cn(t,n,o,e,r),o}function nt(t){return t==="indices"}function an(t){return t===Int8Array||t===Uint8Array}function Ae(t){return t.length?t:t.data}const un=/coord|texture/i,ln=/color|colour/i;function fn(t,e){let n;if(un.test(t)?n=2:ln.test(t)?n=4:n=3,e%n>0)throw new Error(`Can not guess numComponents for attribute '${t}'. Tried ${n} but ${e} values is not evenly divisible by ${n}. You should specify it.`);return n}function Ee(t,e,n){return t.numComponents||t.size||fn(e,n||Ae(t).length)}function ue(t,e){if(ae(t))return t;if(ae(t.data))return t.data;Array.isArray(t)&&(t={data:t});let n=t.type?Be(t.type):void 0;return n||(nt(e)?n=Uint16Array:n=Float32Array),new n(t.data)}function dn(t){return typeof t=="number"?t:t?Qe(t):et}function Be(t){return typeof t=="number"?qt(t):t||Float32Array}function hn(t,e){return{buffer:e.buffer,numValues:2*3*4,type:dn(e.type),arrayType:Be(e.type)}}function pn(t,e){const n=e.data||e,r=Be(e.type),o=n*r.BYTES_PER_ELEMENT,i=t.createBuffer();return t.bindBuffer(O,i),t.bufferData(O,o,e.drawType||Ze),{buffer:i,numValues:n,type:Qe(r),arrayType:r}}function mn(t,e,n){const r=ue(e,n);return{arrayType:r.constructor,buffer:Te(t,r,void 0,e.drawType),type:we(r),numValues:0}}function _n(t,e){const n={};return Object.keys(e).forEach(function(r){if(!nt(r)){const o=e[r],i=o.attrib||o.name||o.attribName||tt.attribPrefix+r;if(o.value){if(!Array.isArray(o.value)&&!ae(o.value))throw new Error("array.value is not array or typedarray");n[i]={value:o.value}}else{let s;o.buffer&&o.buffer instanceof WebGLBuffer?s=hn:typeof o=="number"||typeof o.data=="number"?s=pn:s=mn;const{buffer:c,type:f,numValues:a,arrayType:u}=s(t,o,r),h=o.normalize!==void 0?o.normalize:an(u),l=Ee(o,r,a);n[i]={buffer:c,numComponents:l,type:f,normalize:h,stride:o.stride||0,offset:o.offset||0,divisor:o.divisor===void 0?void 0:o.divisor,drawType:o.drawType}}}}),t.bindBuffer(O,null),n}function gn(t,e){return e===en||e===tn?1:e===nn||e===rn?2:e===on||e===sn||e===et?4:0}const Q=["position","positions","a_position"];function yn(t){let e,n;for(n=0;n<Q.length&&(e=Q[n],!(e in t));++n);n===Q.length&&(e=Object.keys(t)[0]);const r=t[e],o=Ae(r).length;if(o===void 0)return 1;const i=Ee(r,e),s=o/i;if(o%i>0)throw new Error(`numComponents ${i} not correct for length ${o}`);return s}function xn(t,e){let n,r;for(r=0;r<Q.length&&(n=Q[r],!(n in e||(n=tt.attribPrefix+n,n in e)));++r);r===Q.length&&(n=Object.keys(e)[0]);const o=e[n];if(!o.buffer)return 1;t.bindBuffer(O,o.buffer);const i=t.getBufferParameter(O,Jt);t.bindBuffer(O,null);const s=gn(t,o.type),c=i/s,f=o.numComponents||o.size,a=c/f;if(a%1!==0)throw new Error(`numComponents ${f} not correct for length ${length}`);return a}function vn(t,e,n){const r=_n(t,e),o=Object.assign({},n||{});o.attribs=Object.assign({},n?n.attribs:{},r);const i=e.indices;if(i){const s=ue(i,"indices");o.indices=Te(t,s,Je),o.numElements=s.length,o.elementType=we(s)}else o.numElements||(o.numElements=xn(t,o.attribs));return o}function bn(t,e,n){const r=n==="indices"?Je:O,o=ue(e,n);return Te(t,o,r)}function wn(t,e){const n={};return Object.keys(e).forEach(function(r){n[r]=bn(t,e[r],r)}),e.indices?(n.numElements=e.indices.length,n.elementType=we(ue(e.indices))):n.numElements=yn(e),n}const Y=Ae,Tn=Ee;function rt(t,e){let n=0;return t.push=function(){for(let r=0;r<arguments.length;++r){const o=arguments[r];if(o instanceof Array||ae(o))for(let i=0;i<o.length;++i)t[n++]=o[i];else t[n++]=o}},t.reset=function(r){n=r||0},t.numComponents=e,Object.defineProperty(t,"numElements",{get:function(){return this.length/this.numComponents|0}}),t}function y(t,e,n){const r=n||Float32Array;return rt(new r(t*e),t)}function An(t){return t!=="indices"}function En(t){const e=t.indices,n={},r=e.length;function o(i){const s=t[i],c=s.numComponents,f=y(c,r,s.constructor);for(let a=0;a<r;++a){const h=e[a]*c;for(let l=0;l<c;++l)f.push(s[h+l])}n[i]=f}return Object.keys(t).filter(An).forEach(o),n}function Bn(t){if(t.indices)throw new Error("can not flatten normals of indexed vertices. deindex them first");const e=t.normal,n=e.length;for(let r=0;r<n;r+=9){const o=e[r+0],i=e[r+1],s=e[r+2],c=e[r+3],f=e[r+4],a=e[r+5],u=e[r+6],h=e[r+7],l=e[r+8];let p=o+c+u,m=i+f+h,d=s+a+l;const _=Math.sqrt(p*p+m*m+d*d);p/=_,m/=_,d/=_,e[r+0]=p,e[r+1]=m,e[r+2]=d,e[r+3]=p,e[r+4]=m,e[r+5]=d,e[r+6]=p,e[r+7]=m,e[r+8]=d}return t}function Ce(t,e,n){const r=t.length,o=new Float32Array(3);for(let i=0;i<r;i+=3)n(e,[t[i],t[i+1],t[i+2]],o),t[i]=o[0],t[i+1]=o[1],t[i+2]=o[2]}function Cn(t,e,n){n=n||me();const r=e[0],o=e[1],i=e[2];return n[0]=r*t[0*4+0]+o*t[0*4+1]+i*t[0*4+2],n[1]=r*t[1*4+0]+o*t[1*4+1]+i*t[1*4+2],n[2]=r*t[2*4+0]+o*t[2*4+1]+i*t[2*4+2],n}function ot(t,e){return Ce(t,e,Lt),t}function it(t,e){return Ce(t,It(e),Cn),t}function st(t,e){return Ce(t,e,Nt),t}function ct(t,e){return Object.keys(t).forEach(function(n){const r=t[n];n.indexOf("pos")>=0?st(r,e):n.indexOf("tan")>=0||n.indexOf("binorm")>=0?ot(r,e):n.indexOf("norm")>=0&&it(r,e)}),t}function Se(t,e,n){return t=t||2,e=e||0,n=n||0,t*=.5,{position:{numComponents:2,data:[e+-1*t,n+-1*t,e+1*t,n+-1*t,e+-1*t,n+1*t,e+1*t,n+1*t]},normal:[0,0,1,0,0,1,0,0,1,0,0,1],texcoord:[0,0,1,0,0,1,1,1],indices:[0,1,2,2,1,3]}}function Pe(t,e,n,r,o){t=t||1,e=e||1,n=n||1,r=r||1,o=o||Mt();const i=(n+1)*(r+1),s=y(3,i),c=y(3,i),f=y(2,i);for(let l=0;l<=r;l++)for(let p=0;p<=n;p++){const m=p/n,d=l/r;s.push(t*m-t*.5,0,e*d-e*.5),c.push(0,1,0),f.push(m,d)}const a=n+1,u=y(3,n*r*2,Uint16Array);for(let l=0;l<r;l++)for(let p=0;p<n;p++)u.push((l+0)*a+p,(l+1)*a+p,(l+0)*a+p+1),u.push((l+1)*a+p,(l+1)*a+p+1,(l+0)*a+p+1);return ct({position:s,normal:c,texcoord:f,indices:u},o)}function Ue(t,e,n,r,o,i,s){if(e<=0||n<=0)throw new Error("subdivisionAxis and subdivisionHeight must be > 0");r=r||0,o=o||Math.PI,i=i||0,s=s||Math.PI*2;const c=o-r,f=s-i,a=(e+1)*(n+1),u=y(3,a),h=y(3,a),l=y(2,a);for(let d=0;d<=n;d++)for(let _=0;_<=e;_++){const x=_/e,v=d/n,w=f*x+i,T=c*v+r,g=Math.sin(w),b=Math.cos(w),B=Math.sin(T),A=Math.cos(T),E=b*B,S=A,P=g*B;u.push(t*E,t*S,t*P),h.push(E,S,P),l.push(1-x,v)}const p=e+1,m=y(3,e*n*2,Uint16Array);for(let d=0;d<e;d++)for(let _=0;_<n;_++)m.push((_+0)*p+d,(_+0)*p+d+1,(_+1)*p+d),m.push((_+1)*p+d,(_+0)*p+d+1,(_+1)*p+d+1);return{position:u,normal:h,texcoord:l,indices:m}}const Sn=[[3,7,5,1],[6,2,0,4],[6,7,3,2],[0,1,5,4],[7,6,4,5],[2,3,1,0]];function Ge(t){t=t||1;const e=t/2,n=[[-e,-e,-e],[+e,-e,-e],[-e,+e,-e],[+e,+e,-e],[-e,-e,+e],[+e,-e,+e],[-e,+e,+e],[+e,+e,+e]],r=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],o=[[1,0],[0,0],[0,1],[1,1]],i=6*4,s=y(3,i),c=y(3,i),f=y(2,i),a=y(3,6*2,Uint16Array);for(let u=0;u<6;++u){const h=Sn[u];for(let p=0;p<4;++p){const m=n[h[p]],d=r[u],_=o[p];s.push(m),c.push(d),f.push(_)}const l=4*u;a.push(l+0,l+1,l+2),a.push(l+0,l+2,l+3)}return{position:s,normal:c,texcoord:f,indices:a}}function le(t,e,n,r,o,i,s){if(r<3)throw new Error("radialSubdivisions must be 3 or greater");if(o<1)throw new Error("verticalSubdivisions must be 1 or greater");const c=i===void 0?!0:i,f=s===void 0?!0:s,a=(c?2:0)+(f?2:0),u=(r+1)*(o+1+a),h=y(3,u),l=y(3,u),p=y(2,u),m=y(3,r*(o+a/2)*2,Uint16Array),d=r+1,_=Math.atan2(t-e,n),x=Math.cos(_),v=Math.sin(_),w=c?-2:0,T=o+(f?2:0);for(let g=w;g<=T;++g){let b=g/o,B=n*b,A;g<0?(B=0,b=1,A=t):g>o?(B=n,b=1,A=e):A=t+(e-t)*(g/o),(g===-2||g===o+2)&&(A=0,b=0),B-=n/2;for(let E=0;E<d;++E){const S=Math.sin(E*Math.PI*2/r),P=Math.cos(E*Math.PI*2/r);h.push(S*A,B,P*A),g<0?l.push(0,-1,0):g>o?l.push(0,1,0):A===0?l.push(0,0,0):l.push(S*x,v,P*x),p.push(E/r,1-b)}}for(let g=0;g<o+a;++g)if(!(g===1&&c||g===o+a-2&&f))for(let b=0;b<r;++b)m.push(d*(g+0)+0+b,d*(g+0)+1+b,d*(g+1)+1+b),m.push(d*(g+0)+0+b,d*(g+1)+1+b,d*(g+1)+0+b);return{position:h,normal:l,texcoord:p,indices:m}}function Ye(t,e){e=e||[];const n=[];for(let r=0;r<t.length;r+=4){const o=t[r],i=t.slice(r+1,r+4);i.push.apply(i,e);for(let s=0;s<o;++s)n.push.apply(n,i)}return n}function Fe(){const t=[0,0,0,0,150,0,30,0,0,0,150,0,30,150,0,30,0,0,30,0,0,30,30,0,100,0,0,30,30,0,100,30,0,100,0,0,30,60,0,30,90,0,67,60,0,30,90,0,67,90,0,67,60,0,0,0,30,30,0,30,0,150,30,0,150,30,30,0,30,30,150,30,30,0,30,100,0,30,30,30,30,30,30,30,100,0,30,100,30,30,30,60,30,67,60,30,30,90,30,30,90,30,67,60,30,67,90,30,0,0,0,100,0,0,100,0,30,0,0,0,100,0,30,0,0,30,100,0,0,100,30,0,100,30,30,100,0,0,100,30,30,100,0,30,30,30,0,30,30,30,100,30,30,30,30,0,100,30,30,100,30,0,30,30,0,30,60,30,30,30,30,30,30,0,30,60,0,30,60,30,30,60,0,67,60,30,30,60,30,30,60,0,67,60,0,67,60,30,67,60,0,67,90,30,67,60,30,67,60,0,67,90,0,67,90,30,30,90,0,30,90,30,67,90,30,30,90,0,67,90,30,67,90,0,30,90,0,30,150,30,30,90,30,30,90,0,30,150,0,30,150,30,0,150,0,0,150,30,30,150,30,0,150,0,30,150,30,30,150,0,0,0,0,0,0,30,0,150,30,0,0,0,0,150,30,0,150,0],e=[.22,.19,.22,.79,.34,.19,.22,.79,.34,.79,.34,.19,.34,.19,.34,.31,.62,.19,.34,.31,.62,.31,.62,.19,.34,.43,.34,.55,.49,.43,.34,.55,.49,.55,.49,.43,0,0,1,0,0,1,0,1,1,0,1,1,0,0,1,0,0,1,0,1,1,0,1,1,0,0,1,0,0,1,0,1,1,0,1,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1,1,0,1,0,0,1,0,1,1,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,1,1,1,0,0,1,1,1,0],n=Ye([18,0,0,1,18,0,0,-1,6,0,1,0,6,1,0,0,6,0,-1,0,6,1,0,0,6,0,1,0,6,1,0,0,6,0,-1,0,6,1,0,0,6,0,-1,0,6,-1,0,0]),r=Ye([18,200,70,120,18,80,70,200,6,70,200,210,6,200,200,70,6,210,100,70,6,210,160,70,6,70,180,210,6,100,70,210,6,76,210,100,6,140,210,80,6,90,130,110,6,160,160,220],[255]),o=t.length/3,i={position:y(3,o),texcoord:y(2,o),normal:y(3,o),color:y(4,o,Uint8Array),indices:y(3,o/3,Uint16Array)};i.position.push(t),i.texcoord.push(e),i.normal.push(n),i.color.push(r);for(let s=0;s<o;++s)i.indices.push(s);return i}function fe(t,e,n,r,o,i,s){if(o<=0)throw new Error("subdivisionDown must be > 0");i=i||0,s=s||1;const c=2,f=s-i,a=(o+1)*2*(2+c),u=y(3,a),h=y(3,a),l=y(2,a);function p(v,w,T){return v+(w-v)*T}function m(v,w,T,g,b,B){for(let A=0;A<=o;A++){const E=w/(c-1),S=A/o,P=(E-.5)*2,L=(i+S*f)*Math.PI,G=Math.sin(L),k=Math.cos(L),H=p(t,v,G),W=P*r,X=k*t,q=G*H;u.push(W,X,q);const K=$t(Vt([0,G,k],T),g);h.push(K),l.push(E*b+B,S)}}for(let v=0;v<c;v++){const w=(v/(c-1)-.5)*2;m(e,v,[1,1,1],[0,0,0],1,0),m(e,v,[0,0,0],[w,0,0],0,0),m(n,v,[1,1,1],[0,0,0],1,0),m(n,v,[0,0,0],[w,0,0],0,1)}const d=y(3,o*2*(2+c),Uint16Array);function _(v,w){for(let T=0;T<o;++T)d.push(v+T+0,v+T+1,w+T+0),d.push(v+T+1,w+T+1,w+T+0)}const x=o+1;return _(x*0,x*4),_(x*5,x*7),_(x*6,x*2),_(x*3,x*1),{position:u,normal:h,texcoord:l,indices:d}}function Re(t,e,n,r,o,i){return le(t,t,e,n,r,o,i)}function $e(t,e,n,r,o,i){if(n<3)throw new Error("radialSubdivisions must be 3 or greater");if(r<3)throw new Error("verticalSubdivisions must be 3 or greater");o=o||0,i=i||Math.PI*2;const s=i-o,c=n+1,f=r+1,a=c*f,u=y(3,a),h=y(3,a),l=y(2,a),p=y(3,n*r*2,Uint16Array);for(let m=0;m<f;++m){const d=m/r,_=d*Math.PI*2,x=Math.sin(_),v=t+x*e,w=Math.cos(_),T=w*e;for(let g=0;g<c;++g){const b=g/n,B=o+b*s,A=Math.sin(B),E=Math.cos(B),S=A*v,P=E*v,L=A*x,G=E*x;u.push(S,T,P),h.push(L,w,G),l.push(b,1-d)}}for(let m=0;m<r;++m)for(let d=0;d<n;++d){const _=1+d,x=1+m;p.push(c*m+d,c*x+d,c*m+_),p.push(c*x+d,c*x+_,c*m+_)}return{position:u,normal:h,texcoord:l,indices:p}}function Ve(t,e,n,r,o){if(e<3)throw new Error("divisions must be at least 3");n=n||1,o=o||1,r=r||0;const i=(e+1)*(n+1),s=y(3,i),c=y(3,i),f=y(2,i),a=y(3,n*e*2,Uint16Array);let u=0;const h=t-r,l=e+1;for(let p=0;p<=n;++p){const m=r+h*Math.pow(p/n,o);for(let d=0;d<=e;++d){const _=2*Math.PI*d/e,x=m*Math.cos(_),v=m*Math.sin(_);if(s.push(x,0,v),c.push(0,1,0),f.push(1-d/e,p/n),p>0&&d!==e){const w=u+(d+1),T=u+d,g=u+d-l,b=u+(d+1)-l;a.push(w,T,g),a.push(w,g,b)}}u+=e+1}return{position:s,normal:c,texcoord:f,indices:a}}function Pn(t){return Math.random()*t|0}function Un(t,e){e=e||{};const n=t.position.numElements,r=y(4,n,Uint8Array),o=e.rand||function(i,s){return s<3?Pn(256):255};if(t.color=r,t.indices)for(let i=0;i<n;++i)r.push(o(i,0),o(i,1),o(i,2),o(i,3));else{const i=e.vertsPerColor||3,s=n/i;for(let c=0;c<s;++c){const f=[o(c,0),o(c,1),o(c,2),o(c,3)];for(let a=0;a<i;++a)r.push(f)}}return t}function I(t){return function(e){const n=t.apply(this,Array.prototype.slice.call(arguments,1));return wn(e,n)}}function N(t){return function(e){const n=t.apply(null,Array.prototype.slice.call(arguments,1));return vn(e,n)}}const Gn=["numComponents","size","type","normalize","stride","offset","attrib","name","attribName"];function he(t,e,n,r){r=r||0;const o=t.length;for(let i=0;i<o;++i)e[n+i]=t[i]+r}function at(t,e){const n=Y(t),r=new n.constructor(e);let o=r;return n.numComponents&&n.numElements&&rt(r,n.numComponents),t.data&&(o={data:r},Kt(Gn,t,o)),o}function Fn(t){const e={};let n;for(let c=0;c<t.length;++c){const f=t[c];Object.keys(f).forEach(function(a){e[a]||(e[a]=[]),!n&&a!=="indices"&&(n=a);const u=f[a],h=Tn(u,a),p=Y(u).length/h;e[a].push(p)})}function r(c){let f=0,a;for(let u=0;u<t.length;++u){const l=t[u][c],p=Y(l);f+=p.length,(!a||l.data)&&(a=l)}return{length:f,spec:a}}function o(c,f,a){let u=0,h=0;for(let l=0;l<t.length;++l){const m=t[l][c],d=Y(m);c==="indices"?(he(d,a,h,u),u+=f[l]):he(d,a,h),h+=d.length}}const i=e[n],s={};return Object.keys(e).forEach(function(c){const f=r(c),a=at(f.spec,f.length);o(c,i,Y(a)),s[c]=a}),s}function Rn(t){const e={};return Object.keys(t).forEach(function(n){const r=t[n],o=Y(r),i=at(r,o.length);he(o,Y(i),0),e[n]=i}),e}const $n=N(Fe),Vn=I(Fe),Mn=N(Ge),In=I(Ge),Nn=N(Pe),Ln=I(Pe),Dn=N(Ue),zn=I(Ue),On=N(le),kn=I(le),Yn=N(Se),jn=I(Se),ut=N(fe),lt=I(fe),Hn=N(Re),Wn=I(Re),Xn=N($e),qn=I($e),Kn=N(Ve),Qn=I(Ve),Zn=ut,Jn=lt,er=fe;var tr=Object.freeze({__proto__:null,create3DFBufferInfo:$n,create3DFBuffers:Vn,create3DFVertices:Fe,createAugmentedTypedArray:y,createCubeBufferInfo:Mn,createCubeBuffers:In,createCubeVertices:Ge,createPlaneBufferInfo:Nn,createPlaneBuffers:Ln,createPlaneVertices:Pe,createSphereBufferInfo:Dn,createSphereBuffers:zn,createSphereVertices:Ue,createTruncatedConeBufferInfo:On,createTruncatedConeBuffers:kn,createTruncatedConeVertices:le,createXYQuadBufferInfo:Yn,createXYQuadBuffers:jn,createXYQuadVertices:Se,createCresentBufferInfo:Zn,createCresentBuffers:Jn,createCresentVertices:er,createCrescentBufferInfo:ut,createCrescentBuffers:lt,createCrescentVertices:fe,createCylinderBufferInfo:Hn,createCylinderBuffers:Wn,createCylinderVertices:Re,createTorusBufferInfo:Xn,createTorusBuffers:qn,createTorusVertices:$e,createDiscBufferInfo:Kn,createDiscBuffers:Qn,createDiscVertices:Ve,deindexVertices:En,flattenNormals:Bn,makeRandomVertexColors:Un,reorientDirections:ot,reorientNormals:it,reorientPositions:st,reorientVertices:ct,concatVertices:Fn,duplicateVertices:Rn});const F=`struct CellData {
  velocity : vec2<f32>,
  divergence : f32,
  pressure : f32,
  temperature: f32,
}

@group(0) @binding(0) var<storage, read> input : array<CellData>;
@group(0) @binding(1) var<storage, read_write> output : array<CellData>;

struct Uniforms {
  resolution : vec2<f32>,
  simulation_resolution : vec2<f32>,
  delta_time : f32,
  buoyancy: f32,
  viscosity : f32,
  mouse_position : vec2<f32>,
  mouse_delta : vec2<f32>,
  temperature_decay: f32,
  velocity_damping: f32,
  gravity_force: f32,
  noise_strength: f32,
  elapsed_time: f32,
  temp_injected: f32,
  heat_radius: f32
}

@group(1) @binding(0) var<uniform> uniforms : Uniforms;`,R=`fn index_to_coord(index: f32) -> vec2<f32> {
  var x = floor(index % uniforms.simulation_resolution.x);
  var y = floor(index / uniforms.simulation_resolution.x);

  return vec2<f32>(x, y);
}

fn coord_to_index(coord: vec2<f32>) -> f32 {
  return (uniforms.simulation_resolution.x) * coord.y + coord.x;
}

fn coord_to_position(coord: vec2<f32>) -> vec2<f32> {
  let scale = uniforms.simulation_resolution / uniforms.resolution;
  return coord / scale;
}

fn position_to_coord(position: vec2<f32>) -> vec2<f32> {
  let scale = uniforms.simulation_resolution / uniforms.resolution;
  return position * scale;
}

fn get_cell_bilinear(grid_position: vec2<f32>) -> CellData {
  var result: CellData; 


  var coord_a = floor(grid_position);
  var coord_b = vec2<f32>(ceil(grid_position.x), floor(grid_position.y));
  var coord_c = ceil(grid_position);
  var coord_d = vec2<f32>(floor(grid_position.x), ceil(grid_position.y));

  let index_a = u32(coord_to_index(coord_a));
  let index_b = u32(coord_to_index(coord_b));
  let index_c = u32(coord_to_index(coord_c));
  let index_d = u32(coord_to_index(coord_d));//originally let index_d = u32(coord_to_index(coord_b));

  let cell_a = input[index_a];
  let cell_b = input[index_b];
  let cell_c = input[index_c];
  let cell_d = input[index_d];

  let u = grid_position.x - coord_a.x;
  let v = grid_position.y - coord_a.y;

  result.velocity = mix(mix(cell_a.velocity, cell_b.velocity, u), mix(cell_d.velocity, cell_c.velocity, u), v);
  result.divergence = mix(mix(cell_a.divergence, cell_b.divergence, u), mix(cell_d.divergence, cell_c.divergence, u), v);
  result.pressure = mix(mix(cell_a.pressure, cell_b.pressure, u), mix(cell_d.pressure, cell_c.pressure, u), v);
  result.temperature = mix(mix(cell_a.temperature, cell_b.temperature, u), mix(cell_d.temperature, cell_c.temperature, u), v);


  return result;
}

fn get_neighboring_position_values(position: vec2<f32>, offset_distance: vec2<f32>) -> array<CellData, 4> {
  var result: array<CellData, 4>;

  let position_up = vec2<f32>(position.x, clamp(position.y - offset_distance.y, 0, uniforms.resolution.y - 1));
  let position_right = vec2<f32>(clamp(position.x + offset_distance.x, 0, uniforms.resolution.x - 1), position.y);
  let position_down = vec2<f32>(position.x, clamp(position.y + offset_distance.y, 0, uniforms.resolution.y - 1));
  let position_left = vec2<f32>(clamp(position.x - offset_distance.x, 0, uniforms.resolution.x - 1), position.y);

  result[0] = get_cell_bilinear(position_to_coord(position_up));
  result[1] = get_cell_bilinear(position_to_coord(position_right));
  result[2] = get_cell_bilinear(position_to_coord(position_down));
  result[3] = get_cell_bilinear(position_to_coord(position_left));

  return result;
}

fn is_boundary(coord: vec2<f32>) -> bool {
  if (coord.x <= 0 || coord.y <= 0 || coord.x >= uniforms.simulation_resolution.x - 1 || coord.y >= uniforms.simulation_resolution.y - 1) {
    return true;
  }
  return false;
}`,nr=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x * (global_id.y + 1) * (global_id.z + 1);

  if (index >= count) {
    return;
  }
  
  var current_state = input[index];
  let next_state: ptr<storage, CellData, read_write> = &output[index];
  (*next_state) = current_state;

  let coord = index_to_coord(f32(index));
  if (!is_boundary(coord)) {
    return;
  }

  if (
    (coord.y == 0 && coord.x == 0) ||
    (coord.x == uniforms.simulation_resolution.x -1 && coord.y == 0) ||
    (coord.x == uniforms.simulation_resolution.x -1 && coord.y ==uniforms.simulation_resolution.y -1) ||
    (coord.x == 0 && coord.y == uniforms.simulation_resolution.y -1)
  ) {
    return;
  }

  var normal: vec2<f32>;

  if (coord.y == 0) {
    normal = vec2<f32>(0, 1);
  } else if (coord.y == uniforms.simulation_resolution.y - 1) {
    normal = vec2<f32>(0, -1);
  } else if (coord.x == 0) {
    normal = vec2<f32>(1, 0);
  } else if (coord.x == uniforms.simulation_resolution.x -1) {
    normal = vec2<f32>(-1, 0);
  }

  var inner_coord = coord + normal;
  var inner_index = coord_to_index(inner_coord);
  var inner_data = input[u32(inner_index)];


  (*next_state).velocity = inner_data.velocity * -1;
  (*next_state).pressure = inner_data.pressure;
  (*next_state).divergence = inner_data.divergence;
}`,rr=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x;// * (global_id.y + 1) * (global_id.z + 1);

  if (index >= count) {
    return;
  }

  var current_state = input[index];
  let next_state: ptr<storage, CellData, read_write> = &output[index];
  (*next_state) = current_state;

  let coord = index_to_coord(f32(index));
  if (is_boundary(coord)) {
    return;
  }

  let distance_to_mouse = distance(uniforms.mouse_position, coord_to_position(coord));
  var strength = 1 - distance_to_mouse / uniforms.resolution;
 
 //mouse effects
  strength = smoothstep(vec2<f32>(0.95), vec2<f32>(1), strength) * 2.0;
  var velocity = uniforms.mouse_delta * strength * strength;
  
  (*next_state).velocity = (*next_state).velocity + velocity;

  //gravity
  let gravity = vec2<f32>(0.0, uniforms.gravity_force);
  (*next_state).velocity += gravity * uniforms.delta_time;

  //Buoyancy
  let ambient_temperature = 0.0;
  let buoyant_force = uniforms.buoyancy * (current_state.temperature - ambient_temperature);
  (*next_state).velocity.y -= buoyant_force * uniforms.delta_time;

  //air drag
  let damping = uniforms.velocity_damping;
  (*next_state).velocity *= damping;

  //let flickerx = sin(pos.x * 10.0 + uniforms.elapsed_time * 30.0) * cos(pos.y * 10.0 - uniforms.elapsed_time * 20.0);
  //let flicker_strength_x = flickerx * current_state.temperature * 0.1;

  //(*next_state).velocity.x += noise * flicker_strength_x;
  //(*next_state).velocity.y += noise*flicker_strength_y;

  //grid based wind
  let pos = coord_to_position(coord);
  let noise = uniforms.noise_strength;

  let gridCoord = vec2<u32>(u32(pos.x), u32(pos.y));
  let windCell = gridCoord / 16u;

  let timeCycle = floor(uniforms.elapsed_time * 0.1);

  let windSeed = windCell + vec2<u32>(u32(timeCycle));
  let angle = hash2(windSeed) * 6.2831853;

  let wind = vec2<f32>(cos(angle), sin(angle));

  (*next_state).velocity += noise * wind;
}

fn hash2(p: vec2<u32>) -> f32 {
  var x = p.x * 374761393u + p.y * 668265263u;
  x = (x ^ (x >> 13u)) * 1274126177u;
  return f32(x & 0x7FFFFFFFu) / f32(0x7FFFFFFF); // ∈ [0, 1]
}
`,or=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x * (global_id.y + 1) * (global_id.z + 1);

  if (index >= count) {
    return;
  }
  
  var current_state = input[index];
  let next_state: ptr<storage, CellData, read_write> = &output[index];
  (*next_state) = current_state;

  let coord = index_to_coord(f32(index));
  if (is_boundary(coord)) {
    return;
  }

  let position = coord_to_position(coord);
  let previous_grid_position = position - (*next_state).velocity * uniforms.delta_time;
  let interpolated_cell_data = get_cell_bilinear(position_to_coord(previous_grid_position));
  (*next_state).velocity = interpolated_cell_data.velocity;

}`,ir=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x * (global_id.y + 1) * (global_id.z + 1);

  if (index >= count) {
    return;
  }

  var current_state = input[index];
  let next_state: ptr<storage, CellData, read_write> = &output[index];
  (*next_state) = current_state;

  let coord = index_to_coord(f32(index));
  if (is_boundary(coord)) {
    return;
  }
  let position = coord_to_position(coord);

  let current_velocity = current_state.velocity;
  let scale = uniforms.simulation_resolution / uniforms.resolution;
  var offset_distance = vec2<f32>(2) / scale;
  
  let neighbors = get_neighboring_position_values(position, offset_distance);
  let up = neighbors[0];
  let right = neighbors[1];
  let down = neighbors[2];
  let left = neighbors[3];

  var velocity = 4.0 * current_velocity + uniforms.viscosity * uniforms.delta_time * (up.velocity + right.velocity + down.velocity + left.velocity);
  velocity = velocity / (4 * (1 + uniforms.viscosity * uniforms.delta_time)); 

  (*next_state).velocity = velocity;
}`,sr=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x * (global_id.y + 1) * (global_id.z + 1);

  if (index >= count) {
    return;
  }

  var current_state = input[index];
  let next_state: ptr<storage, CellData, read_write> = &output[index];
  (*next_state) = current_state;

  let coord = index_to_coord(f32(index));
  if (is_boundary(coord)) {
    return;
  }
  let position = coord_to_position(coord);
  
  let scale = uniforms.simulation_resolution / uniforms.resolution;
  var offset_distance = vec2<f32>(1) / scale;

  let neighbors = get_neighboring_position_values(position, offset_distance);
  let up = neighbors[0];
  let right = neighbors[1];
  let down = neighbors[2];
  let left = neighbors[3];
  let divergence = (right.velocity.x - left.velocity.x + down.velocity.y - up.velocity.y) / 2;

  (*next_state).velocity = current_state.velocity;
  (*next_state).divergence = divergence / uniforms.delta_time;
}`,cr=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x * (global_id.y + 1) * (global_id.z + 1);

  if (index >= count) {
    return;
  }

  var current_state = input[index];
  let next_state: ptr<storage, CellData, read_write> = &output[index];
  (*next_state) = current_state;

  let coord = index_to_coord(f32(index));
  if (is_boundary(coord)) {
    return;
  }

  let position = coord_to_position(coord);
  
  let scale = uniforms.simulation_resolution / uniforms.resolution;
  var offset_distance = vec2<f32>(2) / scale;
  let neighbors = get_neighboring_position_values(position, offset_distance);
  let up = neighbors[0];
  let right = neighbors[1];
  let down = neighbors[2];
  let left = neighbors[3];

  (*next_state).divergence = current_state.divergence;
  (*next_state).pressure = (up.pressure + right.pressure + down.pressure + left.pressure) / 4 - current_state.divergence;
}`,ar=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x;

  if (index >= count) {
    return;
  }

  var current_state = input[index];
  let next_state: ptr<storage, CellData, read_write> = &output[index];
  (*next_state) = current_state;

  let coord = index_to_coord(f32(index));
  if (is_boundary(coord)) {
    return;
  }

  let position = coord_to_position(coord);
  
  let scale = uniforms.simulation_resolution / uniforms.resolution;
  var offset_distance = vec2<f32>(1) / scale;

  let neighbors = get_neighboring_position_values(position, offset_distance);
  let up = neighbors[0];
  let right = neighbors[1];
  let down = neighbors[2];
  let left = neighbors[3];

  let grad_pressure = vec2<f32>(right.pressure - left.pressure, down.pressure - up.pressure) * 0.5;

  // ✅ Subtract pressure gradient additively
  (*next_state).velocity -= grad_pressure * uniforms.delta_time;
}
`,ur=`

/*struct VertexInput {
  @location(0) position : vec4<f32>,
  @location(2) texcoord : vec2<f32>,
}

struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) texcoord : vec2<f32>,
}
@vertex
fn vertex_main(@builtin(instance_index) instance_index : u32, vert : VertexInput) -> VertexOutput {
  var output : VertexOutput;
  output.position = vec4<f32>(vert.position.x, vert.position.z, 0, 1);
  output.texcoord = vec2<f32>(vert.texcoord.x, 1 - vert.texcoord.y);
  return output;
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = in.texcoord * uniforms.simulation_resolution;
  let interpolated_cell_data = get_cell_bilinear(coord);

  var scaled_velocity = interpolated_cell_data.velocity * 0.001;
  var velocity_color = vec4<f32>((scaled_velocity.xy + 1) / 2, 1, 1);

  velocity_color = mix(vec4<f32>(0,0,0,1), velocity_color, smoothstep(0, uniforms.resolution.x * 0.2, length(interpolated_cell_data.velocity)));

  // return mix(vec4<f32>(1), color, length(scaled_velocity));
  var scaled_divergence = interpolated_cell_data.divergence * 0.1 * uniforms.delta_time;
  var divergence_color = vec4(scaled_divergence, scaled_divergence,scaled_divergence, 1);

  var scaled_pressure = interpolated_cell_data.divergence * 0.1 * uniforms.delta_time;
  var pressure_color = vec4(scaled_pressure, scaled_pressure, scaled_pressure, 1);
  return velocity_color;
  // return vec4<f32>(uniforms.pose_deltas[0].xy * 0.001, 0, 1);

}*/

struct VertexInput {
  @location(0) position : vec4<f32>,
  @location(2) texcoord : vec2<f32>,
}

struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) texcoord : vec2<f32>,
}

@vertex
fn vertex_main(@builtin(instance_index) instance_index : u32, vert : VertexInput) -> VertexOutput {
  var output : VertexOutput;
  output.position = vec4<f32>(vert.position.x, vert.position.z, 0, 1);
  output.texcoord = vec2<f32>(vert.texcoord.x, 1 - vert.texcoord.y);
  return output;
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) vec4<f32> {
  // Convert the texture coordinate to a simulation grid coordinate.
  let coord = in.texcoord * uniforms.simulation_resolution;
  
  // Interpolate the cell data at the given coordinate.
  let interpolated_cell_data = get_cell_bilinear(coord);

  // Get the temperature value from the cell.
  let t = interpolated_cell_data.temperature;
  let heatRatio = clamp(t / uniforms.temp_injected, 0.0, 1.0); // Clamp for safety

  var color: vec4<f32>;

  if (heatRatio < 0.002) {
  // Smoke: gray → black
  let tt = heatRatio / 0.002;
  color = mix(vec4<f32>(0.15, 0.15, 0.15, 1.0), vec4<f32>(0.0, 0.0, 0.0, 1.0), tt);

  } else if (heatRatio < 0.005) {
    // Black → red
    let tt = (heatRatio - 0.002) / 0.003;
    color = mix(vec4<f32>(0.0, 0.0, 0.0, 1.0), vec4<f32>(1.0, 0.0, 0.0, 1.0), tt);

  } else if (heatRatio < 0.015) {
    // Red → orange
    let tt = (heatRatio - 0.005) / 0.01;
    color = mix(vec4<f32>(1.0, 0.0, 0.0, 1.0), vec4<f32>(1.0, 0.5, 0.0, 1.0), tt);

  } else if (heatRatio < 0.03) {
    // Orange → yellow
    let tt = (heatRatio - 0.015) / 0.015;
    color = mix(vec4<f32>(1.0, 0.5, 0.0, 1.0), vec4<f32>(1.0, 1.0, 0.0, 1.0), tt);

  } else {
    // Yellow → white
    let tt = min((heatRatio - 0.03) / 0.02, 1.0);
    color = mix(vec4<f32>(1.0, 1.0, 0.0, 1.0), vec4<f32>(1.0, 1.0, 1.0, 1.0), tt);
  }
  return color;
}
`,lr=`@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) GlobalInvocationID: vec3<u32>) {
  let index = GlobalInvocationID.x;
  if (index >= arrayLength(&output)) {
    return;
  }

  let simRes = uniforms.simulation_resolution;
  let cellX = f32(index % u32(simRes.x));
  let cellY = f32(index / u32(simRes.x));
  let cellPos = index_to_coord(f32(index));

  let wickPos = vec2<f32>(simRes.x * 0.5, simRes.y * 0.8);
  let dist = distance(cellPos, wickPos);

  let heatRadius = 10.0;
  
  // Read the current simulation data.
  let cell = input[index];
  var updatedCell = cell;
  
  if (dist < uniforms.heat_radius) {
    let heatFactor = 1.0 - (dist / uniforms.heat_radius);
    let heatAmount = uniforms.temp_injected * heatFactor * uniforms.delta_time;
    updatedCell.temperature = cell.temperature + heatAmount;
  }
  
  output[index] = updatedCell;
}
`,fr=`@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let count = arrayLength(&output);
  let index = global_id.x;
  if (index >= count) {
    return;
  }

  // Get current state and initialize next state
  var currentCell = input[index];
  var newCell = currentCell;

  // Compute 2D grid coordinate
  let coord = index_to_coord(f32(index));

  // Skip boundary cells
  if (is_boundary(coord)) {
    return;
  }

  // Convert grid coord to world-space position
  let position = coord_to_position(coord);

  // Backtrace using velocity
  let previous_position = position - currentCell.velocity * uniforms.delta_time;

  // Convert back to grid-space coordinate for sampling
  let previous_coord = position_to_coord(previous_position);

  // Sample interpolated cell data at backtraced location
  let sampled = get_cell_bilinear(previous_coord);

  // Update temperature with advected value
  newCell.temperature = sampled.temperature;

  //temperature decay
  newCell.temperature *= exp(-uniforms.temperature_decay * uniforms.delta_time);

  // Store result
  output[index] = newCell;
}
`,z=256,je=.25,dr=2.5,hr=document.querySelector("canvas"),He=new Pt;let $,V;const We=ee(),ce=ee();let Me=!1;const Ie=ee(),Z=ee();let M,U,ft,dt,ht,pt,mt,_t,gt,yt,xt,vt;const bt=()=>{const{delta:t}=He.tick();Ut(Z,Z,1-.01*t),M.member.delta_time=Math.max(Math.min(t,33.33),8)/400,M.member.mouse_position=Ie,M.member.mouse_delta=Z,M.member.elapsed_time=He.elapsedTime,$.run(ft),U.step(),$.run(yt),U.step(),$.run(xt),U.step(),$.run(dt),U.step(),$.run(ht),U.step();for(let e=0;e<24;e++)$.run(pt),U.step();$.run(mt),U.step();for(let e=0;e<24;e++)$.run(_t),U.step();$.run(gt),U.step(),V.render(vt),requestAnimationFrame(bt)},pr=t=>{if(!Me)return;const{clientX:e,clientY:n,movementX:r,movementY:o}=t;Z[0]+=r,Z[1]+=o,de(Ie,e*V.pixelRatio,n*V.pixelRatio)},mr=()=>Me=!0,_r=()=>Me=!1,gr=async()=>{const t=await Rt.requestWebGPU();$=new Tt(t),V=new wt(t,hr),de(We,V.width,V.height),de(ce,Math.round(V.width*je),Math.round(V.height*je)),M=new Bt(t,{resolution:We,simulation_resolution:ce,delta_time:8.33/400,buoyancy:25,viscosity:dr,mouse_position:Ie,mouse_delta:Z,temperature_decay:3,velocity_damping:1,gravity_force:50,noise_strength:3,elapsed_time:0,temp_injected:100,heat_radius:10});const e=ce[0]*ce[1],n=new j({velocity:()=>[0,0],divergence:0,pressure:0,temperature:0},e);U=new St(t,n);const r={simulationInput:U,uniforms:M};ft=new D(t,`${F} ${R} ${nr}`,r,n.count,z),dt=new D(t,`${F} ${R} ${or}`,r,n.count,z),ht=new D(t,`${F} ${R} ${rr}`,r,n.count,z),pt=new D(t,`${F} ${R} ${ir}`,r,n.count,z),mt=new D(t,`${F} ${R} ${sr}`,r,n.count,z),_t=new D(t,`${F} ${R} ${cr}`,r,n.count,z),gt=new D(t,`${F} ${R} ${ar}`,r,n.count,z),yt=new D(t,`${F} ${R} ${lr}`,r,n.count,z),xt=new D(t,`${F} ${R} ${fr}`,r,n.count,z);const o=new Et(V,tr.createPlaneVertices(2,2),1);vt=new At(V,`${F} ${R} ${ur}`,o,{simulation:U,uniforms:M}),window.addEventListener("mousemove",pr),window.addEventListener("mouseup",_r),window.addEventListener("mousedown",mr),requestAnimationFrame(bt);const i=document.getElementById("heatRadius"),s=document.getElementById("noiseStrength"),c=document.getElementById("fireTemp"),f=document.getElementById("heatRadiusValue"),a=document.getElementById("noiseStrengthValue"),u=document.getElementById("fireTempValue");i.addEventListener("input",h=>{const l=parseFloat(h.target.value);f.textContent=l,M.member.heat_radius=l}),s.addEventListener("input",h=>{const l=parseFloat(h.target.value);a.textContent=l,M.member.noise_strength=l}),c.addEventListener("input",h=>{const l=parseFloat(h.target.value);u.textContent=l,M.member.temp_injected=l})};gr();
