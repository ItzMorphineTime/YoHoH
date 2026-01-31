(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const Ch=Math.sqrt(3),ku=.5*(Ch-1),Ss=(3-Ch)/6,Ka=s=>Math.floor(s)|0,$a=new Float64Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,1,0,-1,0,0,1,0,-1,0,1,0,-1]);function Gu(s=Math.random){const e=Vu(s),t=new Float64Array(e).map(i=>$a[i%12*2]),n=new Float64Array(e).map(i=>$a[i%12*2+1]);return function(r,o){let a=0,l=0,c=0;const h=(r+o)*ku,u=Ka(r+h),d=Ka(o+h),p=(u+d)*Ss,g=u-p,_=d-p,m=r-g,f=o-_;let x,v;m>f?(x=1,v=0):(x=0,v=1);const M=m-x+Ss,y=f-v+Ss,b=m-1+2*Ss,w=f-1+2*Ss,U=u&255,S=d&255;let E=.5-m*m-f*f;if(E>=0){const z=U+e[S],D=t[z],O=n[z];E*=E,a=E*E*(D*m+O*f)}let L=.5-M*M-y*y;if(L>=0){const z=U+x+e[S+v],D=t[z],O=n[z];L*=L,l=L*L*(D*M+O*y)}let F=.5-b*b-w*w;if(F>=0){const z=U+1+e[S+1],D=t[z],O=n[z];F*=F,c=F*F*(D*b+O*w)}return 70*(a+l+c)}}function Vu(s){const t=new Uint8Array(512);for(let n=0;n<512/2;n++)t[n]=n;for(let n=0;n<512/2-1;n++){const i=n+~~(s()*(256-n)),r=t[n];t[n]=t[i],t[i]=r}for(let n=256;n<512;n++)t[n]=t[n-256];return t}class Wu{constructor(e=null){this.seed=e??Math.floor(Math.random()*4294967295),this.state=this.seed}next(){let e=this.state+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}nextInt(e,t){return Math.floor(this.next()*(t-e+1))+e}nextFloat(e,t){return e+this.next()*(t-e)}reset(){this.state=this.seed}getSeed(){return this.seed}}const Js={prefix:["Dead Man's","Skull","Devil's","Black","Blood","Rum","Treasure","Ghost","Cursed","Hidden"],body:["Cay","Island","Key","Reef","Harbor","Cove","Port","Bay","Sands","Rock"]};function xa(s={}){const{gridSize:e=128,tileSize:t=8,elevationScale:n=1.2,islandRadius:i=.42,noiseOctaves:r=5,frequency:o=2.2,persistence:a=.45,lacunarity:l=2.1,seed:c=null,seaLevel:h=.12,coastFalloff:u=2.2,coastIrregularity:d=.35,elongation:p=.5,terrainRoughness:g=.7,tileVariation:_=0,chunkSize:m}=s,f=Math.max(2,Math.min(Math.floor(e/2),t??m??8)),x=Math.floor(e/f),v=Math.floor(e/f),M=x*f,y=new Wu(c),b=y.getSeed(),w=Gu(()=>y.next()),U=p<=.5?1+(.5-p)*1.5:1,S=p>=.5?1+(p-.5)*1.5:1,E=[];for(let V=0;V<v;V++){const Q=[];for(let he=0;he<x;he++){const ve=(he+.5)/x-.5,ge=(V+.5)/v-.5,Ae=ve/U,Fe=ge/S,Pe=Math.sqrt(Ae*Ae+Fe*Fe),Ye=d>0?w(ve*8+b*.01,ge*8+b*.02)*d:0,G=i*.5*(1+Ye),Rt=Pe/G,be=Math.max(0,1-Math.pow(Rt,u));let Ue=0,Me=1,at=o,ke=0;for(let T=0;T<r;T++){const k=ve*at*x*.02+b*.001+T*50,re=ge*at*v*.02+b*.002+T*70;Ue+=w(k,re)*Me,ke+=Me,Me*=a,at*=l}Ue=(Ue/ke+1)*.5;const R=Math.max(0,Ue*be*n*g+h);Q.push(R)}E.push(Q)}const L=[];for(let V=0;V<=M;V++){const Q=[];for(let he=0;he<=M;he++){const ve=Math.min(x-1,Math.floor(he/f)),ge=Math.min(v-1,Math.floor(V/f));let Ae=E[ge][ve];if(_>0){const Fe=he/M-.5,Pe=V/M-.5,Ye=w(Fe*20+b*.01,Pe*20+b*.02)*_;Ae=Math.max(0,Ae+Ye)}Q.push(Ae)}L.push(Q)}const F=y.next()<.15,z=!F&&y.next()<.25,D=`${Js.prefix[Math.floor(y.next()*Js.prefix.length)]} ${Js.body[Math.floor(y.next()*Js.body.length)]}`,O=F?"A treacherous place. Sailors speak of it in hushed tones.":z?"A welcoming port with fair winds and friendly faces.":"An unremarkable stop along the trade routes.",H=F?Math.min(3,1+Math.floor(y.next()*2)):Math.floor(y.next()*2),q=y.next(),K=z&&q<.6?q<.3?"harbor":"outpost":q<.2?"outpost":"none",j=["none","reefs","storms","treacherous"],$=F&&y.next()<.6?j[1+Math.floor(y.next()*3)]:"none",te=["neutral","british","spanish","french","pirate"],se=te[Math.floor(y.next()*te.length)];return{heightMap:L,config:{gridSize:M,tileSize:f,tilesX:x,tilesY:v,elevationScale:n,islandRadius:i,noiseOctaves:r,frequency:o,persistence:a,lacunarity:l,seaLevel:h,coastFalloff:u,coastIrregularity:d,elongation:p,terrainRoughness:g,tileVariation:_,chunkSize:f},seed:b,name:D,description:O,dangerous:F,appealing:z,treasureLevel:H,portType:K,hazard:$,faction:se,rumors:""}}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ma="160",Jt={ROTATE:0,DOLLY:1,PAN:2},Fi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Xu=0,Qa=1,Yu=2,qu=0,Lh=1,ju=2,Un=3,si=0,Zt=1,en=2,ti=0,ls=1,Ja=2,el=3,tl=4,Zu=5,mi=100,Ku=101,$u=102,nl=103,il=104,Qu=200,Ju=201,ed=202,td=203,ia=204,sa=205,nd=206,id=207,sd=208,rd=209,od=210,ad=211,ld=212,cd=213,hd=214,ud=0,dd=1,fd=2,Br=3,pd=4,md=5,gd=6,_d=7,jr=0,vd=1,xd=2,ni=0,Md=1,yd=2,Sd=3,Ed=4,bd=5,wd=6,sl="attached",Td="detached",Ih=300,us=301,ds=302,zr=303,ra=304,Zr=306,Os=1e3,tn=1001,oa=1002,Ot=1003,rl=1004,ao=1005,ln=1006,Ad=1007,Bs=1008,ii=1009,Pd=1010,Rd=1011,ya=1012,Dh=1013,Zn=1014,Nn=1015,zs=1016,Uh=1017,Fh=1018,vi=1020,Cd=1021,hn=1023,Ld=1024,Id=1025,xi=1026,fs=1027,Dd=1028,Nh=1029,Ud=1030,Oh=1031,Bh=1033,lo=33776,co=33777,ho=33778,uo=33779,ol=35840,al=35841,ll=35842,cl=35843,zh=36196,hl=37492,ul=37496,dl=37808,fl=37809,pl=37810,ml=37811,gl=37812,_l=37813,vl=37814,xl=37815,Ml=37816,yl=37817,Sl=37818,El=37819,bl=37820,wl=37821,fo=36492,Tl=36494,Al=36495,Fd=36283,Pl=36284,Rl=36285,Cl=36286,Hr=2300,kr=2301,po=2302,Ll=2400,Il=2401,Dl=2402,Nd=2500,Hh=3e3,Mi=3001,Od=3200,Bd=3201,Sa=0,zd=1,un="",Tt="srgb",zn="srgb-linear",Ea="display-p3",Kr="display-p3-linear",Gr="linear",ft="srgb",Vr="rec709",Wr="p3",Ni=7680,Ul=519,Hd=512,kd=513,Gd=514,kh=515,Vd=516,Wd=517,Xd=518,Yd=519,Fl=35044,Nl="300 es",aa=1035,On=2e3,Xr=2001;class Ci{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}}const zt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ol=1234567;const cs=Math.PI/180,ps=180/Math.PI;function ri(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(zt[s&255]+zt[s>>8&255]+zt[s>>16&255]+zt[s>>24&255]+"-"+zt[e&255]+zt[e>>8&255]+"-"+zt[e>>16&15|64]+zt[e>>24&255]+"-"+zt[t&63|128]+zt[t>>8&255]+"-"+zt[t>>16&255]+zt[t>>24&255]+zt[n&255]+zt[n>>8&255]+zt[n>>16&255]+zt[n>>24&255]).toLowerCase()}function Ut(s,e,t){return Math.max(e,Math.min(t,s))}function ba(s,e){return(s%e+e)%e}function qd(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function jd(s,e,t){return s!==e?(t-s)/(e-s):0}function Ds(s,e,t){return(1-t)*s+t*e}function Zd(s,e,t,n){return Ds(s,e,1-Math.exp(-t*n))}function Kd(s,e=1){return e-Math.abs(ba(s,e*2)-e)}function $d(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Qd(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Jd(s,e){return s+Math.floor(Math.random()*(e-s+1))}function ef(s,e){return s+Math.random()*(e-s)}function tf(s){return s*(.5-Math.random())}function nf(s){s!==void 0&&(Ol=s);let e=Ol+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function sf(s){return s*cs}function rf(s){return s*ps}function la(s){return(s&s-1)===0&&s!==0}function of(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Yr(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function af(s,e,t,n,i){const r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),p=r((n-e)/2),g=o((n-e)/2);switch(i){case"XYX":s.set(a*h,l*u,l*d,a*c);break;case"YZY":s.set(l*d,a*h,l*u,a*c);break;case"ZXZ":s.set(l*u,l*d,a*h,a*c);break;case"XZX":s.set(a*h,l*g,l*p,a*c);break;case"YXY":s.set(l*p,a*h,l*g,a*c);break;case"ZYZ":s.set(l*g,l*p,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function es(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Vt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Gt={DEG2RAD:cs,RAD2DEG:ps,generateUUID:ri,clamp:Ut,euclideanModulo:ba,mapLinear:qd,inverseLerp:jd,lerp:Ds,damp:Zd,pingpong:Kd,smoothstep:$d,smootherstep:Qd,randInt:Jd,randFloat:ef,randFloatSpread:tf,seededRandom:nf,degToRad:sf,radToDeg:rf,isPowerOfTwo:la,ceilPowerOfTwo:of,floorPowerOfTwo:Yr,setQuaternionFromProperEuler:af,normalize:Vt,denormalize:es};class Le{constructor(e=0,t=0){Le.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ut(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class $e{constructor(e,t,n,i,r,o,a,l,c){$e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c)}set(e,t,n,i,r,o,a,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],_=i[0],m=i[3],f=i[6],x=i[1],v=i[4],M=i[7],y=i[2],b=i[5],w=i[8];return r[0]=o*_+a*x+l*y,r[3]=o*m+a*v+l*b,r[6]=o*f+a*M+l*w,r[1]=c*_+h*x+u*y,r[4]=c*m+h*v+u*b,r[7]=c*f+h*M+u*w,r[2]=d*_+p*x+g*y,r[5]=d*m+p*v+g*b,r[8]=d*f+p*M+g*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,p=c*r-o*l,g=t*u+n*d+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=u*_,e[1]=(i*c-h*n)*_,e[2]=(a*n-i*o)*_,e[3]=d*_,e[4]=(h*t-i*l)*_,e[5]=(i*r-a*t)*_,e[6]=p*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(mo.makeScale(e,t)),this}rotate(e){return this.premultiply(mo.makeRotation(-e)),this}translate(e,t){return this.premultiply(mo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const mo=new $e;function Gh(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Hs(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function lf(){const s=Hs("canvas");return s.style.display="block",s}const Bl={};function Us(s){s in Bl||(Bl[s]=!0,console.warn(s))}const zl=new $e().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Hl=new $e().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),er={[zn]:{transfer:Gr,primaries:Vr,toReference:s=>s,fromReference:s=>s},[Tt]:{transfer:ft,primaries:Vr,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Kr]:{transfer:Gr,primaries:Wr,toReference:s=>s.applyMatrix3(Hl),fromReference:s=>s.applyMatrix3(zl)},[Ea]:{transfer:ft,primaries:Wr,toReference:s=>s.convertSRGBToLinear().applyMatrix3(Hl),fromReference:s=>s.applyMatrix3(zl).convertLinearToSRGB()}},cf=new Set([zn,Kr]),lt={enabled:!0,_workingColorSpace:zn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!cf.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,e,t){if(this.enabled===!1||e===t||!e||!t)return s;const n=er[e].toReference,i=er[t].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,e){return this.convert(s,this._workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this._workingColorSpace)},getPrimaries:function(s){return er[s].primaries},getTransfer:function(s){return s===un?Gr:er[s].transfer}};function hs(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function go(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Oi;class Vh{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Oi===void 0&&(Oi=Hs("canvas")),Oi.width=e.width,Oi.height=e.height;const n=Oi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Oi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Hs("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=hs(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(hs(t[n]/255)*255):t[n]=hs(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let hf=0;class Wh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:hf++}),this.uuid=ri(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(_o(i[o].image)):r.push(_o(i[o]))}else r=_o(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function _o(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Vh.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let uf=0;class Ft extends Ci{constructor(e=Ft.DEFAULT_IMAGE,t=Ft.DEFAULT_MAPPING,n=tn,i=tn,r=ln,o=Bs,a=hn,l=ii,c=Ft.DEFAULT_ANISOTROPY,h=un){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:uf++}),this.uuid=ri(),this.name="",this.source=new Wh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Le(0,0),this.repeat=new Le(1,1),this.center=new Le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Us("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Mi?Tt:un),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ih)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Os:e.x=e.x-Math.floor(e.x);break;case tn:e.x=e.x<0?0:1;break;case oa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Os:e.y=e.y-Math.floor(e.y);break;case tn:e.y=e.y<0?0:1;break;case oa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Us("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Tt?Mi:Hh}set encoding(e){Us("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===Mi?Tt:un}}Ft.DEFAULT_IMAGE=null;Ft.DEFAULT_MAPPING=Ih;Ft.DEFAULT_ANISOTROPY=1;class ot{constructor(e=0,t=0,n=0,i=1){ot.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],g=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,M=(p+1)/2,y=(f+1)/2,b=(h+d)/4,w=(u+_)/4,U=(g+m)/4;return v>M&&v>y?v<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(v),i=b/n,r=w/n):M>y?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=b/i,r=U/i):y<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(y),n=w/r,i=U/r),this.set(n,i,r,t),this}let x=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-_)/x,this.z=(d-h)/x,this.w=Math.acos((c+p+f-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class df extends Ci{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ot(0,0,e,t),this.scissorTest=!1,this.viewport=new ot(0,0,e,t);const i={width:e,height:t,depth:1};n.encoding!==void 0&&(Us("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Mi?Tt:un),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ln,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Ft(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Wh(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bi extends df{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Xh extends Ft{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Ot,this.minFilter=Ot,this.wrapR=tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ff extends Ft{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Ot,this.minFilter=Ot,this.wrapR=tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ut{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const d=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(u!==_||l!==d||c!==p||h!==g){let m=1-a;const f=l*d+c*p+h*g+u*_,x=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){const y=Math.sqrt(v),b=Math.atan2(y,f*x);m=Math.sin(m*b)/y,a=Math.sin(a*b)/y}const M=a*x;if(l=l*m+d*M,c=c*m+p*M,h=h*m+g*M,u=u*m+_*M,m===1-a){const y=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=y,c*=y,h*=y,u*=y}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[o],d=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+h*u+l*p-c*d,e[t+1]=l*g+h*d+c*u-a*p,e[t+2]=c*g+h*p+a*d-l*u,e[t+3]=h*g-a*u-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(r/2),d=l(n/2),p=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"YZX":this._x=d*h*u+c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u-d*p*g;break;case"XZY":this._x=d*h*u-c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(o-i)*p}else if(n>a&&n>u){const p=2*Math.sqrt(1+n-a-u);this._w=(h-l)/p,this._x=.25*p,this._y=(i+o)/p,this._z=(r+c)/p}else if(a>u){const p=2*Math.sqrt(1+a-n-u);this._w=(r-c)/p,this._x=(i+o)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+u-n-a);this._w=(o-i)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ut(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*i+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(i),n*Math.sin(r),n*Math.cos(r),t*Math.sin(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(e=0,t=0,n=0){C.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(kl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(kl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),h=2*(a*t-r*i),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=i+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return vo.copy(this).projectOnVector(e),this.sub(vo)}reflect(e){return this.sub(vo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ut(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const vo=new C,kl=new ut;class Li{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(fn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(fn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=fn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,fn):fn.fromBufferAttribute(r,o),fn.applyMatrix4(e.matrixWorld),this.expandByPoint(fn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),tr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),tr.copy(n.boundingBox)),tr.applyMatrix4(e.matrixWorld),this.union(tr)}const i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,fn),fn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Es),nr.subVectors(this.max,Es),Bi.subVectors(e.a,Es),zi.subVectors(e.b,Es),Hi.subVectors(e.c,Es),Hn.subVectors(zi,Bi),kn.subVectors(Hi,zi),li.subVectors(Bi,Hi);let t=[0,-Hn.z,Hn.y,0,-kn.z,kn.y,0,-li.z,li.y,Hn.z,0,-Hn.x,kn.z,0,-kn.x,li.z,0,-li.x,-Hn.y,Hn.x,0,-kn.y,kn.x,0,-li.y,li.x,0];return!xo(t,Bi,zi,Hi,nr)||(t=[1,0,0,0,1,0,0,0,1],!xo(t,Bi,zi,Hi,nr))?!1:(ir.crossVectors(Hn,kn),t=[ir.x,ir.y,ir.z],xo(t,Bi,zi,Hi,nr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,fn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(fn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Pn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Pn=[new C,new C,new C,new C,new C,new C,new C,new C],fn=new C,tr=new Li,Bi=new C,zi=new C,Hi=new C,Hn=new C,kn=new C,li=new C,Es=new C,nr=new C,ir=new C,ci=new C;function xo(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){ci.fromArray(s,r);const a=i.x*Math.abs(ci.x)+i.y*Math.abs(ci.y)+i.z*Math.abs(ci.z),l=e.dot(ci),c=t.dot(ci),h=n.dot(ci);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const pf=new Li,bs=new C,Mo=new C;class gs{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):pf.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;bs.subVectors(e,this.center);const t=bs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(bs,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Mo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(bs.copy(e.center).add(Mo)),this.expandByPoint(bs.copy(e.center).sub(Mo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Rn=new C,yo=new C,sr=new C,Gn=new C,So=new C,rr=new C,Eo=new C;class js{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Rn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Rn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Rn.copy(this.origin).addScaledVector(this.direction,t),Rn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){yo.copy(e).add(t).multiplyScalar(.5),sr.copy(t).sub(e).normalize(),Gn.copy(this.origin).sub(yo);const r=e.distanceTo(t)*.5,o=-this.direction.dot(sr),a=Gn.dot(this.direction),l=-Gn.dot(sr),c=Gn.lengthSq(),h=Math.abs(1-o*o);let u,d,p,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,p=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(yo).addScaledVector(sr,d),p}intersectSphere(e,t){Rn.subVectors(e.center,this.origin);const n=Rn.dot(this.direction),i=Rn.dot(Rn)-n*n,r=e.radius*e.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Rn)!==null}intersectTriangle(e,t,n,i,r){So.subVectors(t,e),rr.subVectors(n,e),Eo.crossVectors(So,rr);let o=this.direction.dot(Eo),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Gn.subVectors(this.origin,e);const l=a*this.direction.dot(rr.crossVectors(Gn,rr));if(l<0)return null;const c=a*this.direction.dot(So.cross(Gn));if(c<0||l+c>o)return null;const h=-a*Gn.dot(Eo);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Te{constructor(e,t,n,i,r,o,a,l,c,h,u,d,p,g,_,m){Te.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c,h,u,d,p,g,_,m)}set(e,t,n,i,r,o,a,l,c,h,u,d,p,g,_,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=i,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Te().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/ki.setFromMatrixColumn(e,0).length(),r=1/ki.setFromMatrixColumn(e,1).length(),o=1/ki.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=o*h,p=o*u,g=a*h,_=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+g*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=g+p*c,t[10]=o*l}else if(e.order==="YXZ"){const d=l*h,p=l*u,g=c*h,_=c*u;t[0]=d+_*a,t[4]=g*a-p,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=p*a-g,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){const d=l*h,p=l*u,g=c*h,_=c*u;t[0]=d-_*a,t[4]=-o*u,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*h,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const d=o*h,p=o*u,g=a*h,_=a*u;t[0]=l*h,t[4]=g*c-p,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=p*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const d=o*l,p=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=_-d*u,t[8]=g*u+p,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=p*u+g,t[10]=d-_*u}else if(e.order==="XZY"){const d=o*l,p=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=o*h,t[9]=p*u-g,t[2]=g*u-p,t[6]=a*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(mf,e,gf)}lookAt(e,t,n){const i=this.elements;return $t.subVectors(e,t),$t.lengthSq()===0&&($t.z=1),$t.normalize(),Vn.crossVectors(n,$t),Vn.lengthSq()===0&&(Math.abs(n.z)===1?$t.x+=1e-4:$t.z+=1e-4,$t.normalize(),Vn.crossVectors(n,$t)),Vn.normalize(),or.crossVectors($t,Vn),i[0]=Vn.x,i[4]=or.x,i[8]=$t.x,i[1]=Vn.y,i[5]=or.y,i[9]=$t.y,i[2]=Vn.z,i[6]=or.z,i[10]=$t.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],_=n[6],m=n[10],f=n[14],x=n[3],v=n[7],M=n[11],y=n[15],b=i[0],w=i[4],U=i[8],S=i[12],E=i[1],L=i[5],F=i[9],z=i[13],D=i[2],O=i[6],H=i[10],q=i[14],K=i[3],j=i[7],$=i[11],te=i[15];return r[0]=o*b+a*E+l*D+c*K,r[4]=o*w+a*L+l*O+c*j,r[8]=o*U+a*F+l*H+c*$,r[12]=o*S+a*z+l*q+c*te,r[1]=h*b+u*E+d*D+p*K,r[5]=h*w+u*L+d*O+p*j,r[9]=h*U+u*F+d*H+p*$,r[13]=h*S+u*z+d*q+p*te,r[2]=g*b+_*E+m*D+f*K,r[6]=g*w+_*L+m*O+f*j,r[10]=g*U+_*F+m*H+f*$,r[14]=g*S+_*z+m*q+f*te,r[3]=x*b+v*E+M*D+y*K,r[7]=x*w+v*L+M*O+y*j,r[11]=x*U+v*F+M*H+y*$,r[15]=x*S+v*z+M*q+y*te,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],p=e[14],g=e[3],_=e[7],m=e[11],f=e[15];return g*(+r*l*u-i*c*u-r*a*d+n*c*d+i*a*p-n*l*p)+_*(+t*l*p-t*c*d+r*o*d-i*o*p+i*c*h-r*l*h)+m*(+t*c*u-t*a*p-r*o*u+n*o*p+r*a*h-n*c*h)+f*(-i*a*h-t*l*u+t*a*d+i*o*u-n*o*d+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],p=e[11],g=e[12],_=e[13],m=e[14],f=e[15],x=u*m*c-_*d*c+_*l*p-a*m*p-u*l*f+a*d*f,v=g*d*c-h*m*c-g*l*p+o*m*p+h*l*f-o*d*f,M=h*_*c-g*u*c+g*a*p-o*_*p-h*a*f+o*u*f,y=g*u*l-h*_*l-g*a*d+o*_*d+h*a*m-o*u*m,b=t*x+n*v+i*M+r*y;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/b;return e[0]=x*w,e[1]=(_*d*r-u*m*r-_*i*p+n*m*p+u*i*f-n*d*f)*w,e[2]=(a*m*r-_*l*r+_*i*c-n*m*c-a*i*f+n*l*f)*w,e[3]=(u*l*r-a*d*r-u*i*c+n*d*c+a*i*p-n*l*p)*w,e[4]=v*w,e[5]=(h*m*r-g*d*r+g*i*p-t*m*p-h*i*f+t*d*f)*w,e[6]=(g*l*r-o*m*r-g*i*c+t*m*c+o*i*f-t*l*f)*w,e[7]=(o*d*r-h*l*r+h*i*c-t*d*c-o*i*p+t*l*p)*w,e[8]=M*w,e[9]=(g*u*r-h*_*r-g*n*p+t*_*p+h*n*f-t*u*f)*w,e[10]=(o*_*r-g*a*r+g*n*c-t*_*c-o*n*f+t*a*f)*w,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*p-t*a*p)*w,e[12]=y*w,e[13]=(h*_*i-g*u*i+g*n*d-t*_*d-h*n*m+t*u*m)*w,e[14]=(g*a*i-o*_*i-g*n*l+t*_*l+o*n*m-t*a*m)*w,e[15]=(o*u*i-h*a*i+h*n*l-t*u*l-o*n*d+t*a*d)*w,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,p=r*h,g=r*u,_=o*h,m=o*u,f=a*u,x=l*c,v=l*h,M=l*u,y=n.x,b=n.y,w=n.z;return i[0]=(1-(_+f))*y,i[1]=(p+M)*y,i[2]=(g-v)*y,i[3]=0,i[4]=(p-M)*b,i[5]=(1-(d+f))*b,i[6]=(m+x)*b,i[7]=0,i[8]=(g+v)*w,i[9]=(m-x)*w,i[10]=(1-(d+_))*w,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=ki.set(i[0],i[1],i[2]).length();const o=ki.set(i[4],i[5],i[6]).length(),a=ki.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],pn.copy(this);const c=1/r,h=1/o,u=1/a;return pn.elements[0]*=c,pn.elements[1]*=c,pn.elements[2]*=c,pn.elements[4]*=h,pn.elements[5]*=h,pn.elements[6]*=h,pn.elements[8]*=u,pn.elements[9]*=u,pn.elements[10]*=u,t.setFromRotationMatrix(pn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=On){const l=this.elements,c=2*r/(t-e),h=2*r/(n-i),u=(t+e)/(t-e),d=(n+i)/(n-i);let p,g;if(a===On)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Xr)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=On){const l=this.elements,c=1/(t-e),h=1/(n-i),u=1/(o-r),d=(t+e)*c,p=(n+i)*h;let g,_;if(a===On)g=(o+r)*u,_=-2*u;else if(a===Xr)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ki=new C,pn=new Te,mf=new C(0,0,0),gf=new C(1,1,1),Vn=new C,or=new C,$t=new C,Gl=new Te,Vl=new ut;class Yt{constructor(e=0,t=0,n=0,i=Yt.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],p=i[10];switch(t){case"XYZ":this._y=Math.asin(Ut(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ut(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ut(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ut(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ut(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Ut(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Gl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Gl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Vl.setFromEuler(this),this.setFromQuaternion(Vl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Yt.DEFAULT_ORDER="XYZ";class wa{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let _f=0;const Wl=new C,Gi=new ut,Cn=new Te,ar=new C,ws=new C,vf=new C,xf=new ut,Xl=new C(1,0,0),Yl=new C(0,1,0),ql=new C(0,0,1),Mf={type:"added"},yf={type:"removed"};class dt extends Ci{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_f++}),this.uuid=ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=dt.DEFAULT_UP.clone();const e=new C,t=new Yt,n=new ut,i=new C(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Te},normalMatrix:{value:new $e}}),this.matrix=new Te,this.matrixWorld=new Te,this.matrixAutoUpdate=dt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Gi.setFromAxisAngle(e,t),this.quaternion.multiply(Gi),this}rotateOnWorldAxis(e,t){return Gi.setFromAxisAngle(e,t),this.quaternion.premultiply(Gi),this}rotateX(e){return this.rotateOnAxis(Xl,e)}rotateY(e){return this.rotateOnAxis(Yl,e)}rotateZ(e){return this.rotateOnAxis(ql,e)}translateOnAxis(e,t){return Wl.copy(e).applyQuaternion(this.quaternion),this.position.add(Wl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Xl,e)}translateY(e){return this.translateOnAxis(Yl,e)}translateZ(e){return this.translateOnAxis(ql,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Cn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ar.copy(e):ar.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),ws.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cn.lookAt(ws,ar,this.up):Cn.lookAt(ar,ws,this.up),this.quaternion.setFromRotationMatrix(Cn),i&&(Cn.extractRotation(i.matrixWorld),Gi.setFromRotationMatrix(Cn),this.quaternion.premultiply(Gi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Mf)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(yf)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Cn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Cn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Cn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ws,e,vf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ws,xf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++){const a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}dt.DEFAULT_UP=new C(0,1,0);dt.DEFAULT_MATRIX_AUTO_UPDATE=!0;dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const mn=new C,Ln=new C,bo=new C,In=new C,Vi=new C,Wi=new C,jl=new C,wo=new C,To=new C,Ao=new C;let lr=!1;class cn{constructor(e=new C,t=new C,n=new C){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),mn.subVectors(e,t),i.cross(mn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){mn.subVectors(i,t),Ln.subVectors(n,t),bo.subVectors(e,t);const o=mn.dot(mn),a=mn.dot(Ln),l=mn.dot(bo),c=Ln.dot(Ln),h=Ln.dot(bo),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,p=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,In)===null?!1:In.x>=0&&In.y>=0&&In.x+In.y<=1}static getUV(e,t,n,i,r,o,a,l){return lr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),lr=!0),this.getInterpolation(e,t,n,i,r,o,a,l)}static getInterpolation(e,t,n,i,r,o,a,l){return this.getBarycoord(e,t,n,i,In)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,In.x),l.addScaledVector(o,In.y),l.addScaledVector(a,In.z),l)}static isFrontFacing(e,t,n,i){return mn.subVectors(n,t),Ln.subVectors(e,t),mn.cross(Ln).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return mn.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),mn.cross(Ln).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return cn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return cn.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,r){return lr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),lr=!0),cn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}getInterpolation(e,t,n,i,r){return cn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return cn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return cn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let o,a;Vi.subVectors(i,n),Wi.subVectors(r,n),wo.subVectors(e,n);const l=Vi.dot(wo),c=Wi.dot(wo);if(l<=0&&c<=0)return t.copy(n);To.subVectors(e,i);const h=Vi.dot(To),u=Wi.dot(To);if(h>=0&&u<=h)return t.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(Vi,o);Ao.subVectors(e,r);const p=Vi.dot(Ao),g=Wi.dot(Ao);if(g>=0&&p<=g)return t.copy(r);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(Wi,a);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return jl.subVectors(r,i),a=(u-h)/(u-h+(p-g)),t.copy(i).addScaledVector(jl,a);const f=1/(m+_+d);return o=_*f,a=d*f,t.copy(n).addScaledVector(Vi,o).addScaledVector(Wi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Yh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wn={h:0,s:0,l:0},cr={h:0,s:0,l:0};function Po(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class He{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Tt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,lt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=lt.workingColorSpace){return this.r=e,this.g=t,this.b=n,lt.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=lt.workingColorSpace){if(e=ba(e,1),t=Ut(t,0,1),n=Ut(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Po(o,r,e+1/3),this.g=Po(o,r,e),this.b=Po(o,r,e-1/3)}return lt.toWorkingColorSpace(this,i),this}setStyle(e,t=Tt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Tt){const n=Yh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=hs(e.r),this.g=hs(e.g),this.b=hs(e.b),this}copyLinearToSRGB(e){return this.r=go(e.r),this.g=go(e.g),this.b=go(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Tt){return lt.fromWorkingColorSpace(Ht.copy(this),e),Math.round(Ut(Ht.r*255,0,255))*65536+Math.round(Ut(Ht.g*255,0,255))*256+Math.round(Ut(Ht.b*255,0,255))}getHexString(e=Tt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=lt.workingColorSpace){lt.fromWorkingColorSpace(Ht.copy(this),t);const n=Ht.r,i=Ht.g,r=Ht.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=lt.workingColorSpace){return lt.fromWorkingColorSpace(Ht.copy(this),t),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=Tt){lt.fromWorkingColorSpace(Ht.copy(this),e);const t=Ht.r,n=Ht.g,i=Ht.b;return e!==Tt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Wn),this.setHSL(Wn.h+e,Wn.s+t,Wn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Wn),e.getHSL(cr);const n=Ds(Wn.h,cr.h,t),i=Ds(Wn.s,cr.s,t),r=Ds(Wn.l,cr.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ht=new He;He.NAMES=Yh;let Sf=0;class Ii extends Ci{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Sf++}),this.uuid=ri(),this.name="",this.type="Material",this.blending=ls,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ia,this.blendDst=sa,this.blendEquation=mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new He(0,0,0),this.blendAlpha=0,this.depthFunc=Br,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ul,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ni,this.stencilZFail=Ni,this.stencilZPass=Ni,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ls&&(n.blending=this.blending),this.side!==si&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ia&&(n.blendSrc=this.blendSrc),this.blendDst!==sa&&(n.blendDst=this.blendDst),this.blendEquation!==mi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Br&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ul&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ni&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ni&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ni&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Fn extends Ii{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new He(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=jr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Pt=new C,hr=new Le;class Mn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Fl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Nn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)hr.fromBufferAttribute(this,t),hr.applyMatrix3(e),this.setXY(t,hr.x,hr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix3(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=es(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Vt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=es(t,this.array)),t}setX(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=es(t,this.array)),t}setY(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=es(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=es(t,this.array)),t}setW(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array),i=Vt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array),i=Vt(i,this.array),r=Vt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Fl&&(e.usage=this.usage),e}}class Ta extends Mn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class qh extends Mn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class nt extends Mn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Ef=0;const on=new Te,Ro=new dt,Xi=new C,Qt=new Li,Ts=new Li,Dt=new C;class yt extends Ci{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=ri(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Gh(e)?qh:Ta)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new $e().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return on.makeRotationFromQuaternion(e),this.applyMatrix4(on),this}rotateX(e){return on.makeRotationX(e),this.applyMatrix4(on),this}rotateY(e){return on.makeRotationY(e),this.applyMatrix4(on),this}rotateZ(e){return on.makeRotationZ(e),this.applyMatrix4(on),this}translate(e,t,n){return on.makeTranslation(e,t,n),this.applyMatrix4(on),this}scale(e,t,n){return on.makeScale(e,t,n),this.applyMatrix4(on),this}lookAt(e){return Ro.lookAt(e),Ro.updateMatrix(),this.applyMatrix4(Ro.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Xi).negate(),this.translate(Xi.x,Xi.y,Xi.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new nt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Li);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Qt.setFromBufferAttribute(r),this.morphTargetsRelative?(Dt.addVectors(this.boundingBox.min,Qt.min),this.boundingBox.expandByPoint(Dt),Dt.addVectors(this.boundingBox.max,Qt.max),this.boundingBox.expandByPoint(Dt)):(this.boundingBox.expandByPoint(Qt.min),this.boundingBox.expandByPoint(Qt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new C,1/0);return}if(e){const n=this.boundingSphere.center;if(Qt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];Ts.setFromBufferAttribute(a),this.morphTargetsRelative?(Dt.addVectors(Qt.min,Ts.min),Qt.expandByPoint(Dt),Dt.addVectors(Qt.max,Ts.max),Qt.expandByPoint(Dt)):(Qt.expandByPoint(Ts.min),Qt.expandByPoint(Ts.max))}Qt.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)Dt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Dt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Dt.fromBufferAttribute(a,c),l&&(Xi.fromBufferAttribute(e,c),Dt.add(Xi)),i=Math.max(i,n.distanceToSquared(Dt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,i=t.position.array,r=t.normal.array,o=t.uv.array,a=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Mn(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let E=0;E<a;E++)c[E]=new C,h[E]=new C;const u=new C,d=new C,p=new C,g=new Le,_=new Le,m=new Le,f=new C,x=new C;function v(E,L,F){u.fromArray(i,E*3),d.fromArray(i,L*3),p.fromArray(i,F*3),g.fromArray(o,E*2),_.fromArray(o,L*2),m.fromArray(o,F*2),d.sub(u),p.sub(u),_.sub(g),m.sub(g);const z=1/(_.x*m.y-m.x*_.y);isFinite(z)&&(f.copy(d).multiplyScalar(m.y).addScaledVector(p,-_.y).multiplyScalar(z),x.copy(p).multiplyScalar(_.x).addScaledVector(d,-m.x).multiplyScalar(z),c[E].add(f),c[L].add(f),c[F].add(f),h[E].add(x),h[L].add(x),h[F].add(x))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let E=0,L=M.length;E<L;++E){const F=M[E],z=F.start,D=F.count;for(let O=z,H=z+D;O<H;O+=3)v(n[O+0],n[O+1],n[O+2])}const y=new C,b=new C,w=new C,U=new C;function S(E){w.fromArray(r,E*3),U.copy(w);const L=c[E];y.copy(L),y.sub(w.multiplyScalar(w.dot(L))).normalize(),b.crossVectors(U,L);const z=b.dot(h[E])<0?-1:1;l[E*4]=y.x,l[E*4+1]=y.y,l[E*4+2]=y.z,l[E*4+3]=z}for(let E=0,L=M.length;E<L;++E){const F=M[E],z=F.start,D=F.count;for(let O=z,H=z+D;O<H;O+=3)S(n[O+0]),S(n[O+1]),S(n[O+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Mn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const i=new C,r=new C,o=new C,a=new C,l=new C,c=new C,h=new C,u=new C;if(e)for(let d=0,p=e.count;d<p;d+=3){const g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Dt.fromBufferAttribute(e,t),Dt.normalize(),e.setXYZ(t,Dt.x,Dt.y,Dt.z)}toNonIndexed(){function e(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*h;for(let f=0;f<h;f++)d[g++]=c[p++]}return new Mn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new yt,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],p=e(d,n);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Zl=new Te,hi=new js,ur=new gs,Kl=new C,Yi=new C,qi=new C,ji=new C,Co=new C,dr=new C,fr=new Le,pr=new Le,mr=new Le,$l=new C,Ql=new C,Jl=new C,gr=new C,_r=new C;class ce extends dt{constructor(e=new yt,t=new Fn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){dr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(Co.fromBufferAttribute(u,e),o?dr.addScaledVector(Co,h):dr.addScaledVector(Co.sub(t),h))}t.add(dr)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ur.copy(n.boundingSphere),ur.applyMatrix4(r),hi.copy(e.ray).recast(e.near),!(ur.containsPoint(hi.origin)===!1&&(hi.intersectSphere(ur,Kl)===null||hi.origin.distanceToSquared(Kl)>(e.far-e.near)**2))&&(Zl.copy(r).invert(),hi.copy(e.ray).applyMatrix4(Zl),!(n.boundingBox!==null&&hi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,hi)))}_computeIntersections(e,t,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],f=o[m.materialIndex],x=Math.max(m.start,p.start),v=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let M=x,y=v;M<y;M+=3){const b=a.getX(M),w=a.getX(M+1),U=a.getX(M+2);i=vr(this,f,e,n,c,h,u,b,w,U),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const x=a.getX(m),v=a.getX(m+1),M=a.getX(m+2);i=vr(this,o,e,n,c,h,u,x,v,M),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],f=o[m.materialIndex],x=Math.max(m.start,p.start),v=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let M=x,y=v;M<y;M+=3){const b=M,w=M+1,U=M+2;i=vr(this,f,e,n,c,h,u,b,w,U),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const x=m,v=m+1,M=m+2;i=vr(this,o,e,n,c,h,u,x,v,M),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function bf(s,e,t,n,i,r,o,a){let l;if(e.side===Zt?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,e.side===si,a),l===null)return null;_r.copy(a),_r.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(_r);return c<t.near||c>t.far?null:{distance:c,point:_r.clone(),object:s}}function vr(s,e,t,n,i,r,o,a,l,c){s.getVertexPosition(a,Yi),s.getVertexPosition(l,qi),s.getVertexPosition(c,ji);const h=bf(s,e,t,n,Yi,qi,ji,gr);if(h){i&&(fr.fromBufferAttribute(i,a),pr.fromBufferAttribute(i,l),mr.fromBufferAttribute(i,c),h.uv=cn.getInterpolation(gr,Yi,qi,ji,fr,pr,mr,new Le)),r&&(fr.fromBufferAttribute(r,a),pr.fromBufferAttribute(r,l),mr.fromBufferAttribute(r,c),h.uv1=cn.getInterpolation(gr,Yi,qi,ji,fr,pr,mr,new Le),h.uv2=h.uv1),o&&($l.fromBufferAttribute(o,a),Ql.fromBufferAttribute(o,l),Jl.fromBufferAttribute(o,c),h.normal=cn.getInterpolation(gr,Yi,qi,ji,$l,Ql,Jl,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new C,materialIndex:0};cn.getNormal(Yi,qi,ji,u.normal),h.face=u}return h}class ht extends yt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,p=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new nt(c,3)),this.setAttribute("normal",new nt(h,3)),this.setAttribute("uv",new nt(u,2));function g(_,m,f,x,v,M,y,b,w,U,S){const E=M/w,L=y/U,F=M/2,z=y/2,D=b/2,O=w+1,H=U+1;let q=0,K=0;const j=new C;for(let $=0;$<H;$++){const te=$*L-z;for(let se=0;se<O;se++){const V=se*E-F;j[_]=V*x,j[m]=te*v,j[f]=D,c.push(j.x,j.y,j.z),j[_]=0,j[m]=0,j[f]=b>0?1:-1,h.push(j.x,j.y,j.z),u.push(se/w),u.push(1-$/U),q+=1}}for(let $=0;$<U;$++)for(let te=0;te<w;te++){const se=d+te+O*$,V=d+te+O*($+1),Q=d+(te+1)+O*($+1),he=d+(te+1)+O*$;l.push(se,V,he),l.push(V,Q,he),K+=6}a.addGroup(p,K,S),p+=K,d+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ht(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ms(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Wt(s){const e={};for(let t=0;t<s.length;t++){const n=ms(s[t]);for(const i in n)e[i]=n[i]}return e}function wf(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function jh(s){return s.getRenderTarget()===null?s.outputColorSpace:lt.workingColorSpace}const Tf={clone:ms,merge:Wt};var Af=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Pf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class wi extends Ii{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Af,this.fragmentShader=Pf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ms(e.uniforms),this.uniformsGroups=wf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Zh extends dt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Te,this.projectionMatrix=new Te,this.projectionMatrixInverse=new Te,this.coordinateSystem=On}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class qt extends Zh{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ps*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(cs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ps*2*Math.atan(Math.tan(cs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(cs*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Zi=-90,Ki=1;class Rf extends dt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new qt(Zi,Ki,e,t);i.layers=this.layers,this.add(i);const r=new qt(Zi,Ki,e,t);r.layers=this.layers,this.add(r);const o=new qt(Zi,Ki,e,t);o.layers=this.layers,this.add(o);const a=new qt(Zi,Ki,e,t);a.layers=this.layers,this.add(a);const l=new qt(Zi,Ki,e,t);l.layers=this.layers,this.add(l);const c=new qt(Zi,Ki,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===On)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Xr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Kh extends Ft{constructor(e,t,n,i,r,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:us,super(e,t,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Cf extends bi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];t.encoding!==void 0&&(Us("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===Mi?Tt:un),this.texture=new Kh(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:ln}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new ht(5,5,5),r=new wi({name:"CubemapFromEquirect",uniforms:ms(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Zt,blending:ti});r.uniforms.tEquirect.value=t;const o=new ce(i,r),a=t.minFilter;return t.minFilter===Bs&&(t.minFilter=ln),new Rf(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}}const Lo=new C,Lf=new C,If=new $e;class qn{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Lo.subVectors(n,t).cross(Lf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Lo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||If.getNormalMatrix(e),i=this.coplanarPoint(Lo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ui=new gs,xr=new C;class Aa{constructor(e=new qn,t=new qn,n=new qn,i=new qn,r=new qn,o=new qn){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=On){const n=this.planes,i=e.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],u=i[6],d=i[7],p=i[8],g=i[9],_=i[10],m=i[11],f=i[12],x=i[13],v=i[14],M=i[15];if(n[0].setComponents(l-r,d-c,m-p,M-f).normalize(),n[1].setComponents(l+r,d+c,m+p,M+f).normalize(),n[2].setComponents(l+o,d+h,m+g,M+x).normalize(),n[3].setComponents(l-o,d-h,m-g,M-x).normalize(),n[4].setComponents(l-a,d-u,m-_,M-v).normalize(),t===On)n[5].setComponents(l+a,d+u,m+_,M+v).normalize();else if(t===Xr)n[5].setComponents(a,u,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ui.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ui.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ui)}intersectsSprite(e){return ui.center.set(0,0,0),ui.radius=.7071067811865476,ui.applyMatrix4(e.matrixWorld),this.intersectsSphere(ui)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(xr.x=i.normal.x>0?e.max.x:e.min.x,xr.y=i.normal.y>0?e.max.y:e.min.y,xr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(xr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function $h(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Df(s,e){const t=e.isWebGL2,n=new WeakMap;function i(c,h){const u=c.array,d=c.usage,p=u.byteLength,g=s.createBuffer();s.bindBuffer(h,g),s.bufferData(h,u,d),c.onUploadCallback();let _;if(u instanceof Float32Array)_=s.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)_=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=s.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=s.SHORT;else if(u instanceof Uint32Array)_=s.UNSIGNED_INT;else if(u instanceof Int32Array)_=s.INT;else if(u instanceof Int8Array)_=s.BYTE;else if(u instanceof Uint8Array)_=s.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:p}}function r(c,h,u){const d=h.array,p=h._updateRange,g=h.updateRanges;if(s.bindBuffer(u,c),p.count===-1&&g.length===0&&s.bufferSubData(u,0,d),g.length!==0){for(let _=0,m=g.length;_<m;_++){const f=g[_];t?s.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d,f.start,f.count):s.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d.subarray(f.start,f.start+f.count))}h.clearUpdateRanges()}p.count!==-1&&(t?s.bufferSubData(u,p.offset*d.BYTES_PER_ELEMENT,d,p.offset,p.count):s.bufferSubData(u,p.offset*d.BYTES_PER_ELEMENT,d.subarray(p.offset,p.offset+p.count)),p.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);if(u===void 0)n.set(c,i(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,c,h),u.version=c.version}}return{get:o,remove:a,update:l}}class Kn extends yt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=e/a,d=t/l,p=[],g=[],_=[],m=[];for(let f=0;f<h;f++){const x=f*d-o;for(let v=0;v<c;v++){const M=v*u-r;g.push(M,-x,0),_.push(0,0,1),m.push(v/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let x=0;x<a;x++){const v=x+c*f,M=x+c*(f+1),y=x+1+c*(f+1),b=x+1+c*f;p.push(v,M,b),p.push(M,y,b)}this.setIndex(p),this.setAttribute("position",new nt(g,3)),this.setAttribute("normal",new nt(_,3)),this.setAttribute("uv",new nt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Kn(e.width,e.height,e.widthSegments,e.heightSegments)}}var Uf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ff=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Nf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Of=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Bf=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,zf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Hf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,kf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Gf=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Vf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Wf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Xf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Yf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,qf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,jf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Zf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Kf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,$f=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Qf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Jf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ep=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,tp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,np=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,ip=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,sp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,rp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,op=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ap=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,lp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,cp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,hp="gl_FragColor = linearToOutputTexel( gl_FragColor );",up=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,dp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,fp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,pp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,mp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,gp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,_p=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,xp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Mp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,yp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Sp=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Ep=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Tp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ap=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Pp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Rp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Cp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Lp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ip=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Dp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Up=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Fp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Np=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Op=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Bp=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Hp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,kp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Gp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Wp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Xp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Yp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,qp=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,jp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Zp=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Kp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,$p=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Qp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Jp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,em=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,nm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,im=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,sm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,rm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,om=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,am=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,lm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,cm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,hm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,um=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,fm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,pm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,mm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,gm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,_m=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,vm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,xm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Mm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ym=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Sm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Em=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,bm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,wm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Tm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Am=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Pm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Rm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Cm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Lm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Im=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Dm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Um=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Om=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Bm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Hm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,km=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Gm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Vm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Wm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ym=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,qm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,jm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Km=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$m=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Qm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,eg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,tg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ng=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ig=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,sg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,og=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ag=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,lg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,cg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ug=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,dg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qe={alphahash_fragment:Uf,alphahash_pars_fragment:Ff,alphamap_fragment:Nf,alphamap_pars_fragment:Of,alphatest_fragment:Bf,alphatest_pars_fragment:zf,aomap_fragment:Hf,aomap_pars_fragment:kf,batching_pars_vertex:Gf,batching_vertex:Vf,begin_vertex:Wf,beginnormal_vertex:Xf,bsdfs:Yf,iridescence_fragment:qf,bumpmap_pars_fragment:jf,clipping_planes_fragment:Zf,clipping_planes_pars_fragment:Kf,clipping_planes_pars_vertex:$f,clipping_planes_vertex:Qf,color_fragment:Jf,color_pars_fragment:ep,color_pars_vertex:tp,color_vertex:np,common:ip,cube_uv_reflection_fragment:sp,defaultnormal_vertex:rp,displacementmap_pars_vertex:op,displacementmap_vertex:ap,emissivemap_fragment:lp,emissivemap_pars_fragment:cp,colorspace_fragment:hp,colorspace_pars_fragment:up,envmap_fragment:dp,envmap_common_pars_fragment:fp,envmap_pars_fragment:pp,envmap_pars_vertex:mp,envmap_physical_pars_fragment:Ap,envmap_vertex:gp,fog_vertex:_p,fog_pars_vertex:vp,fog_fragment:xp,fog_pars_fragment:Mp,gradientmap_pars_fragment:yp,lightmap_fragment:Sp,lightmap_pars_fragment:Ep,lights_lambert_fragment:bp,lights_lambert_pars_fragment:wp,lights_pars_begin:Tp,lights_toon_fragment:Pp,lights_toon_pars_fragment:Rp,lights_phong_fragment:Cp,lights_phong_pars_fragment:Lp,lights_physical_fragment:Ip,lights_physical_pars_fragment:Dp,lights_fragment_begin:Up,lights_fragment_maps:Fp,lights_fragment_end:Np,logdepthbuf_fragment:Op,logdepthbuf_pars_fragment:Bp,logdepthbuf_pars_vertex:zp,logdepthbuf_vertex:Hp,map_fragment:kp,map_pars_fragment:Gp,map_particle_fragment:Vp,map_particle_pars_fragment:Wp,metalnessmap_fragment:Xp,metalnessmap_pars_fragment:Yp,morphcolor_vertex:qp,morphnormal_vertex:jp,morphtarget_pars_vertex:Zp,morphtarget_vertex:Kp,normal_fragment_begin:$p,normal_fragment_maps:Qp,normal_pars_fragment:Jp,normal_pars_vertex:em,normal_vertex:tm,normalmap_pars_fragment:nm,clearcoat_normal_fragment_begin:im,clearcoat_normal_fragment_maps:sm,clearcoat_pars_fragment:rm,iridescence_pars_fragment:om,opaque_fragment:am,packing:lm,premultiplied_alpha_fragment:cm,project_vertex:hm,dithering_fragment:um,dithering_pars_fragment:dm,roughnessmap_fragment:fm,roughnessmap_pars_fragment:pm,shadowmap_pars_fragment:mm,shadowmap_pars_vertex:gm,shadowmap_vertex:_m,shadowmask_pars_fragment:vm,skinbase_vertex:xm,skinning_pars_vertex:Mm,skinning_vertex:ym,skinnormal_vertex:Sm,specularmap_fragment:Em,specularmap_pars_fragment:bm,tonemapping_fragment:wm,tonemapping_pars_fragment:Tm,transmission_fragment:Am,transmission_pars_fragment:Pm,uv_pars_fragment:Rm,uv_pars_vertex:Cm,uv_vertex:Lm,worldpos_vertex:Im,background_vert:Dm,background_frag:Um,backgroundCube_vert:Fm,backgroundCube_frag:Nm,cube_vert:Om,cube_frag:Bm,depth_vert:zm,depth_frag:Hm,distanceRGBA_vert:km,distanceRGBA_frag:Gm,equirect_vert:Vm,equirect_frag:Wm,linedashed_vert:Xm,linedashed_frag:Ym,meshbasic_vert:qm,meshbasic_frag:jm,meshlambert_vert:Zm,meshlambert_frag:Km,meshmatcap_vert:$m,meshmatcap_frag:Qm,meshnormal_vert:Jm,meshnormal_frag:eg,meshphong_vert:tg,meshphong_frag:ng,meshphysical_vert:ig,meshphysical_frag:sg,meshtoon_vert:rg,meshtoon_frag:og,points_vert:ag,points_frag:lg,shadow_vert:cg,shadow_frag:hg,sprite_vert:ug,sprite_frag:dg},ue={common:{diffuse:{value:new He(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new Le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new He(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new He(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new He(16777215)},opacity:{value:1},center:{value:new Le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},bn={basic:{uniforms:Wt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:Wt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new He(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:Wt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new He(0)},specular:{value:new He(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:Wt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new He(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:Wt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new He(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:Wt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:Wt([ue.points,ue.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:Wt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:Wt([ue.common,ue.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:Wt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:Wt([ue.sprite,ue.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distanceRGBA:{uniforms:Wt([ue.common,ue.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distanceRGBA_vert,fragmentShader:qe.distanceRGBA_frag},shadow:{uniforms:Wt([ue.lights,ue.fog,{color:{value:new He(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};bn.physical={uniforms:Wt([bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new Le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new He(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new Le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new He(0)},specularColor:{value:new He(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new Le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};const Mr={r:0,b:0,g:0};function fg(s,e,t,n,i,r,o){const a=new He(0);let l=r===!0?0:1,c,h,u=null,d=0,p=null;function g(m,f){let x=!1,v=f.isScene===!0?f.background:null;v&&v.isTexture&&(v=(f.backgroundBlurriness>0?t:e).get(v)),v===null?_(a,l):v&&v.isColor&&(_(v,1),x=!0);const M=s.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,o):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||x)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),v&&(v.isCubeTexture||v.mapping===Zr)?(h===void 0&&(h=new ce(new ht(1,1,1),new wi({name:"BackgroundCubeMaterial",uniforms:ms(bn.backgroundCube.uniforms),vertexShader:bn.backgroundCube.vertexShader,fragmentShader:bn.backgroundCube.fragmentShader,side:Zt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(y,b,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,h.material.toneMapped=lt.getTransfer(v.colorSpace)!==ft,(u!==v||d!==v.version||p!==s.toneMapping)&&(h.material.needsUpdate=!0,u=v,d=v.version,p=s.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new ce(new Kn(2,2),new wi({name:"BackgroundMaterial",uniforms:ms(bn.background.uniforms),vertexShader:bn.background.vertexShader,fragmentShader:bn.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,c.material.toneMapped=lt.getTransfer(v.colorSpace)!==ft,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||p!==s.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,p=s.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function _(m,f){m.getRGB(Mr,jh(s)),n.buffers.color.setClear(Mr.r,Mr.g,Mr.b,f,o)}return{getClearColor:function(){return a},setClearColor:function(m,f=1){a.set(m),l=f,_(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,_(a,l)},render:g}}function pg(s,e,t,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=m(null);let c=l,h=!1;function u(D,O,H,q,K){let j=!1;if(o){const $=_(q,H,O);c!==$&&(c=$,p(c.object)),j=f(D,q,H,K),j&&x(D,q,H,K)}else{const $=O.wireframe===!0;(c.geometry!==q.id||c.program!==H.id||c.wireframe!==$)&&(c.geometry=q.id,c.program=H.id,c.wireframe=$,j=!0)}K!==null&&t.update(K,s.ELEMENT_ARRAY_BUFFER),(j||h)&&(h=!1,U(D,O,H,q),K!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(K).buffer))}function d(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function p(D){return n.isWebGL2?s.bindVertexArray(D):r.bindVertexArrayOES(D)}function g(D){return n.isWebGL2?s.deleteVertexArray(D):r.deleteVertexArrayOES(D)}function _(D,O,H){const q=H.wireframe===!0;let K=a[D.id];K===void 0&&(K={},a[D.id]=K);let j=K[O.id];j===void 0&&(j={},K[O.id]=j);let $=j[q];return $===void 0&&($=m(d()),j[q]=$),$}function m(D){const O=[],H=[],q=[];for(let K=0;K<i;K++)O[K]=0,H[K]=0,q[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:H,attributeDivisors:q,object:D,attributes:{},index:null}}function f(D,O,H,q){const K=c.attributes,j=O.attributes;let $=0;const te=H.getAttributes();for(const se in te)if(te[se].location>=0){const Q=K[se];let he=j[se];if(he===void 0&&(se==="instanceMatrix"&&D.instanceMatrix&&(he=D.instanceMatrix),se==="instanceColor"&&D.instanceColor&&(he=D.instanceColor)),Q===void 0||Q.attribute!==he||he&&Q.data!==he.data)return!0;$++}return c.attributesNum!==$||c.index!==q}function x(D,O,H,q){const K={},j=O.attributes;let $=0;const te=H.getAttributes();for(const se in te)if(te[se].location>=0){let Q=j[se];Q===void 0&&(se==="instanceMatrix"&&D.instanceMatrix&&(Q=D.instanceMatrix),se==="instanceColor"&&D.instanceColor&&(Q=D.instanceColor));const he={};he.attribute=Q,Q&&Q.data&&(he.data=Q.data),K[se]=he,$++}c.attributes=K,c.attributesNum=$,c.index=q}function v(){const D=c.newAttributes;for(let O=0,H=D.length;O<H;O++)D[O]=0}function M(D){y(D,0)}function y(D,O){const H=c.newAttributes,q=c.enabledAttributes,K=c.attributeDivisors;H[D]=1,q[D]===0&&(s.enableVertexAttribArray(D),q[D]=1),K[D]!==O&&((n.isWebGL2?s:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](D,O),K[D]=O)}function b(){const D=c.newAttributes,O=c.enabledAttributes;for(let H=0,q=O.length;H<q;H++)O[H]!==D[H]&&(s.disableVertexAttribArray(H),O[H]=0)}function w(D,O,H,q,K,j,$){$===!0?s.vertexAttribIPointer(D,O,H,K,j):s.vertexAttribPointer(D,O,H,q,K,j)}function U(D,O,H,q){if(n.isWebGL2===!1&&(D.isInstancedMesh||q.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;v();const K=q.attributes,j=H.getAttributes(),$=O.defaultAttributeValues;for(const te in j){const se=j[te];if(se.location>=0){let V=K[te];if(V===void 0&&(te==="instanceMatrix"&&D.instanceMatrix&&(V=D.instanceMatrix),te==="instanceColor"&&D.instanceColor&&(V=D.instanceColor)),V!==void 0){const Q=V.normalized,he=V.itemSize,ve=t.get(V);if(ve===void 0)continue;const ge=ve.buffer,Ae=ve.type,Fe=ve.bytesPerElement,Pe=n.isWebGL2===!0&&(Ae===s.INT||Ae===s.UNSIGNED_INT||V.gpuType===Dh);if(V.isInterleavedBufferAttribute){const Ye=V.data,G=Ye.stride,Rt=V.offset;if(Ye.isInstancedInterleavedBuffer){for(let be=0;be<se.locationSize;be++)y(se.location+be,Ye.meshPerAttribute);D.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=Ye.meshPerAttribute*Ye.count)}else for(let be=0;be<se.locationSize;be++)M(se.location+be);s.bindBuffer(s.ARRAY_BUFFER,ge);for(let be=0;be<se.locationSize;be++)w(se.location+be,he/se.locationSize,Ae,Q,G*Fe,(Rt+he/se.locationSize*be)*Fe,Pe)}else{if(V.isInstancedBufferAttribute){for(let Ye=0;Ye<se.locationSize;Ye++)y(se.location+Ye,V.meshPerAttribute);D.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let Ye=0;Ye<se.locationSize;Ye++)M(se.location+Ye);s.bindBuffer(s.ARRAY_BUFFER,ge);for(let Ye=0;Ye<se.locationSize;Ye++)w(se.location+Ye,he/se.locationSize,Ae,Q,he*Fe,he/se.locationSize*Ye*Fe,Pe)}}else if($!==void 0){const Q=$[te];if(Q!==void 0)switch(Q.length){case 2:s.vertexAttrib2fv(se.location,Q);break;case 3:s.vertexAttrib3fv(se.location,Q);break;case 4:s.vertexAttrib4fv(se.location,Q);break;default:s.vertexAttrib1fv(se.location,Q)}}}}b()}function S(){F();for(const D in a){const O=a[D];for(const H in O){const q=O[H];for(const K in q)g(q[K].object),delete q[K];delete O[H]}delete a[D]}}function E(D){if(a[D.id]===void 0)return;const O=a[D.id];for(const H in O){const q=O[H];for(const K in q)g(q[K].object),delete q[K];delete O[H]}delete a[D.id]}function L(D){for(const O in a){const H=a[O];if(H[D.id]===void 0)continue;const q=H[D.id];for(const K in q)g(q[K].object),delete q[K];delete H[D.id]}}function F(){z(),h=!0,c!==l&&(c=l,p(c.object))}function z(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:F,resetDefaultState:z,dispose:S,releaseStatesOfGeometry:E,releaseStatesOfProgram:L,initAttributes:v,enableAttribute:M,disableUnusedAttributes:b}}function mg(s,e,t,n){const i=n.isWebGL2;let r;function o(h){r=h}function a(h,u){s.drawArrays(r,h,u),t.update(u,r,1)}function l(h,u,d){if(d===0)return;let p,g;if(i)p=s,g="drawArraysInstanced";else if(p=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[g](r,h,u,d),t.update(u,r,d)}function c(h,u,d){if(d===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{p.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_];t.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function gg(s,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(w){if(w==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let a=t.precision!==void 0?t.precision:"highp";const l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),_=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),f=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),v=d>0,M=o||e.has("OES_texture_float"),y=v&&M,b=o?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:p,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:f,maxFragmentUniforms:x,vertexTextures:v,floatFragmentTextures:M,floatVertexTextures:y,maxSamples:b}}function _g(s){const e=this;let t=null,n=0,i=!1,r=!1;const o=new qn,a=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const p=u.length!==0||d||n!==0||i;return i=d,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,p){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,f=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{const x=r?0:n,v=x*4;let M=f.clippingState||null;l.value=M,M=h(g,d,v,p);for(let y=0;y!==v;++y)M[y]=t[y];f.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,p,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const f=p+_*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<f)&&(m=new Float32Array(f));for(let v=0,M=p;v!==_;++v,M+=4)o.copy(u[v]).applyMatrix4(x,a),o.normal.toArray(m,M),m[M+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function vg(s){let e=new WeakMap;function t(o,a){return a===zr?o.mapping=us:a===ra&&(o.mapping=ds),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===zr||a===ra)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Cf(l.height/2);return c.fromEquirectangularTexture(s,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Pa extends Zh{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const ss=4,ec=[.125,.215,.35,.446,.526,.582],gi=20,Io=new Pa,tc=new He;let Do=null,Uo=0,Fo=0;const fi=(1+Math.sqrt(5))/2,$i=1/fi,nc=[new C(1,1,1),new C(-1,1,1),new C(1,1,-1),new C(-1,1,-1),new C(0,fi,$i),new C(0,fi,-$i),new C($i,0,fi),new C(-$i,0,fi),new C(fi,$i,0),new C(-fi,$i,0)];class ic{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Do=this._renderer.getRenderTarget(),Uo=this._renderer.getActiveCubeFace(),Fo=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=oc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=rc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Do,Uo,Fo),e.scissorTest=!1,yr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===us||e.mapping===ds?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Do=this._renderer.getRenderTarget(),Uo=this._renderer.getActiveCubeFace(),Fo=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ln,minFilter:ln,generateMipmaps:!1,type:zs,format:hn,colorSpace:zn,depthBuffer:!1},i=sc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=sc(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=xg(r)),this._blurMaterial=Mg(r,e,t)}return i}_compileMaterial(e){const t=new ce(this._lodPlanes[0],e);this._renderer.compile(t,Io)}_sceneToCubeUV(e,t,n,i){const a=new qt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(tc),h.toneMapping=ni,h.autoClear=!1;const p=new Fn({name:"PMREM.Background",side:Zt,depthWrite:!1,depthTest:!1}),g=new ce(new ht,p);let _=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,_=!0):(p.color.copy(tc),_=!0);for(let f=0;f<6;f++){const x=f%3;x===0?(a.up.set(0,l[f],0),a.lookAt(c[f],0,0)):x===1?(a.up.set(0,0,l[f]),a.lookAt(0,c[f],0)):(a.up.set(0,l[f],0),a.lookAt(0,0,c[f]));const v=this._cubeSize;yr(i,x*v,f>2?v:0,v,v),h.setRenderTarget(i),_&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===us||e.mapping===ds;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=oc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=rc());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new ce(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;yr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Io)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),o=nc[(i-1)%nc.length];this._blur(e,i-1,i,r,o)}t.autoClear=n}_blur(e,t,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ce(this._lodPlanes[i],c),d=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*gi-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):gi;m>gi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${gi}`);const f=[];let x=0;for(let w=0;w<gi;++w){const U=w/_,S=Math.exp(-U*U/2);f.push(S),w===0?x+=S:w<m&&(x+=2*S)}for(let w=0;w<f.length;w++)f[w]=f[w]/x;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:v}=this;d.dTheta.value=g,d.mipInt.value=v-n;const M=this._sizeLods[i],y=3*M*(i>v-ss?i-v+ss:0),b=4*(this._cubeSize-M);yr(t,y,b,3*M,2*M),l.setRenderTarget(t),l.render(u,Io)}}function xg(s){const e=[],t=[],n=[];let i=s;const r=s-ss+1+ec.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>s-ss?l=ec[o-s+ss-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,m=2,f=1,x=new Float32Array(_*g*p),v=new Float32Array(m*g*p),M=new Float32Array(f*g*p);for(let b=0;b<p;b++){const w=b%3*2/3-1,U=b>2?0:-1,S=[w,U,0,w+2/3,U,0,w+2/3,U+1,0,w,U,0,w+2/3,U+1,0,w,U+1,0];x.set(S,_*g*b),v.set(d,m*g*b);const E=[b,b,b,b,b,b];M.set(E,f*g*b)}const y=new yt;y.setAttribute("position",new Mn(x,_)),y.setAttribute("uv",new Mn(v,m)),y.setAttribute("faceIndex",new Mn(M,f)),e.push(y),i>ss&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function sc(s,e,t){const n=new bi(s,e,t);return n.texture.mapping=Zr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function yr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Mg(s,e,t){const n=new Float32Array(gi),i=new C(0,1,0);return new wi({name:"SphericalGaussianBlur",defines:{n:gi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function rc(){return new wi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function oc(){return new wi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Ra(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function yg(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===zr||l===ra,h=l===us||l===ds;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=e.get(a);return t===null&&(t=new ic(s)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),e.set(a,u),u.texture}else{if(e.has(a))return e.get(a).texture;{const u=a.image;if(c&&u&&u.height>0||h&&u&&i(u)){t===null&&(t=new ic(s));const d=c?t.fromEquirectangular(a):t.fromCubemap(a);return e.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Sg(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Eg(s,e,t,n){const i={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let m=0,f=_.length;m<f;m++)e.remove(_[m])}d.removeEventListener("dispose",o),delete i[d.id];const p=r.get(d);p&&(e.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const g in d)e.update(d[g],s.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const _=p[g];for(let m=0,f=_.length;m<f;m++)e.update(_[m],s.ARRAY_BUFFER)}}function c(u){const d=[],p=u.index,g=u.attributes.position;let _=0;if(p!==null){const x=p.array;_=p.version;for(let v=0,M=x.length;v<M;v+=3){const y=x[v+0],b=x[v+1],w=x[v+2];d.push(y,b,b,w,w,y)}}else if(g!==void 0){const x=g.array;_=g.version;for(let v=0,M=x.length/3-1;v<M;v+=3){const y=v+0,b=v+1,w=v+2;d.push(y,b,b,w,w,y)}}else return;const m=new(Gh(d)?qh:Ta)(d,1);m.version=_;const f=r.get(u);f&&e.remove(f),r.set(u,m)}function h(u){const d=r.get(u);if(d){const p=u.index;p!==null&&d.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function bg(s,e,t,n){const i=n.isWebGL2;let r;function o(p){r=p}let a,l;function c(p){a=p.type,l=p.bytesPerElement}function h(p,g){s.drawElements(r,g,a,p*l),t.update(g,r,1)}function u(p,g,_){if(_===0)return;let m,f;if(i)m=s,f="drawElementsInstanced";else if(m=e.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[f](r,g,a,p*l,_),t.update(g,r,_)}function d(p,g,_){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<_;f++)this.render(p[f]/l,g[f]);else{m.multiDrawElementsWEBGL(r,g,0,a,p,0,_);let f=0;for(let x=0;x<_;x++)f+=g[x];t.update(f,r,1)}}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function wg(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Tg(s,e){return s[0]-e[0]}function Ag(s,e){return Math.abs(e[1])-Math.abs(s[1])}function Pg(s,e,t){const n={},i=new Float32Array(8),r=new WeakMap,o=new ot,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,u){const d=c.morphTargetInfluences;if(e.isWebGL2===!0){const g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,_=g!==void 0?g.length:0;let m=r.get(h);if(m===void 0||m.count!==_){let O=function(){z.dispose(),r.delete(h),h.removeEventListener("dispose",O)};var p=O;m!==void 0&&m.texture.dispose();const v=h.morphAttributes.position!==void 0,M=h.morphAttributes.normal!==void 0,y=h.morphAttributes.color!==void 0,b=h.morphAttributes.position||[],w=h.morphAttributes.normal||[],U=h.morphAttributes.color||[];let S=0;v===!0&&(S=1),M===!0&&(S=2),y===!0&&(S=3);let E=h.attributes.position.count*S,L=1;E>e.maxTextureSize&&(L=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const F=new Float32Array(E*L*4*_),z=new Xh(F,E,L,_);z.type=Nn,z.needsUpdate=!0;const D=S*4;for(let H=0;H<_;H++){const q=b[H],K=w[H],j=U[H],$=E*L*4*H;for(let te=0;te<q.count;te++){const se=te*D;v===!0&&(o.fromBufferAttribute(q,te),F[$+se+0]=o.x,F[$+se+1]=o.y,F[$+se+2]=o.z,F[$+se+3]=0),M===!0&&(o.fromBufferAttribute(K,te),F[$+se+4]=o.x,F[$+se+5]=o.y,F[$+se+6]=o.z,F[$+se+7]=0),y===!0&&(o.fromBufferAttribute(j,te),F[$+se+8]=o.x,F[$+se+9]=o.y,F[$+se+10]=o.z,F[$+se+11]=j.itemSize===4?o.w:1)}}m={count:_,texture:z,size:new Le(E,L)},r.set(h,m),h.addEventListener("dispose",O)}let f=0;for(let v=0;v<d.length;v++)f+=d[v];const x=h.morphTargetsRelative?1:1-f;u.getUniforms().setValue(s,"morphTargetBaseInfluence",x),u.getUniforms().setValue(s,"morphTargetInfluences",d),u.getUniforms().setValue(s,"morphTargetsTexture",m.texture,t),u.getUniforms().setValue(s,"morphTargetsTextureSize",m.size)}else{const g=d===void 0?0:d.length;let _=n[h.id];if(_===void 0||_.length!==g){_=[];for(let M=0;M<g;M++)_[M]=[M,0];n[h.id]=_}for(let M=0;M<g;M++){const y=_[M];y[0]=M,y[1]=d[M]}_.sort(Ag);for(let M=0;M<8;M++)M<g&&_[M][1]?(a[M][0]=_[M][0],a[M][1]=_[M][1]):(a[M][0]=Number.MAX_SAFE_INTEGER,a[M][1]=0);a.sort(Tg);const m=h.morphAttributes.position,f=h.morphAttributes.normal;let x=0;for(let M=0;M<8;M++){const y=a[M],b=y[0],w=y[1];b!==Number.MAX_SAFE_INTEGER&&w?(m&&h.getAttribute("morphTarget"+M)!==m[b]&&h.setAttribute("morphTarget"+M,m[b]),f&&h.getAttribute("morphNormal"+M)!==f[b]&&h.setAttribute("morphNormal"+M,f[b]),i[M]=w,x+=w):(m&&h.hasAttribute("morphTarget"+M)===!0&&h.deleteAttribute("morphTarget"+M),f&&h.hasAttribute("morphNormal"+M)===!0&&h.deleteAttribute("morphNormal"+M),i[M]=0)}const v=h.morphTargetsRelative?1:1-x;u.getUniforms().setValue(s,"morphTargetBaseInfluence",v),u.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function Rg(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return u}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}class Qh extends Ft{constructor(e,t,n,i,r,o,a,l,c,h){if(h=h!==void 0?h:xi,h!==xi&&h!==fs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===xi&&(n=Zn),n===void 0&&h===fs&&(n=vi),super(null,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Ot,this.minFilter=l!==void 0?l:Ot,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Jh=new Ft,eu=new Qh(1,1);eu.compareFunction=kh;const tu=new Xh,nu=new ff,iu=new Kh,ac=[],lc=[],cc=new Float32Array(16),hc=new Float32Array(9),uc=new Float32Array(4);function _s(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=ac[i];if(r===void 0&&(r=new Float32Array(i),ac[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function Ct(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Lt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function $r(s,e){let t=lc[e];t===void 0&&(t=new Int32Array(e),lc[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Cg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Lg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;s.uniform2fv(this.addr,e),Lt(t,e)}}function Ig(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ct(t,e))return;s.uniform3fv(this.addr,e),Lt(t,e)}}function Dg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;s.uniform4fv(this.addr,e),Lt(t,e)}}function Ug(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Lt(t,e)}else{if(Ct(t,n))return;uc.set(n),s.uniformMatrix2fv(this.addr,!1,uc),Lt(t,n)}}function Fg(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Lt(t,e)}else{if(Ct(t,n))return;hc.set(n),s.uniformMatrix3fv(this.addr,!1,hc),Lt(t,n)}}function Ng(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ct(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Lt(t,e)}else{if(Ct(t,n))return;cc.set(n),s.uniformMatrix4fv(this.addr,!1,cc),Lt(t,n)}}function Og(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Bg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;s.uniform2iv(this.addr,e),Lt(t,e)}}function zg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ct(t,e))return;s.uniform3iv(this.addr,e),Lt(t,e)}}function Hg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;s.uniform4iv(this.addr,e),Lt(t,e)}}function kg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Gg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;s.uniform2uiv(this.addr,e),Lt(t,e)}}function Vg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ct(t,e))return;s.uniform3uiv(this.addr,e),Lt(t,e)}}function Wg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;s.uniform4uiv(this.addr,e),Lt(t,e)}}function Xg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?eu:Jh;t.setTexture2D(e||r,i)}function Yg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||nu,i)}function qg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||iu,i)}function jg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||tu,i)}function Zg(s){switch(s){case 5126:return Cg;case 35664:return Lg;case 35665:return Ig;case 35666:return Dg;case 35674:return Ug;case 35675:return Fg;case 35676:return Ng;case 5124:case 35670:return Og;case 35667:case 35671:return Bg;case 35668:case 35672:return zg;case 35669:case 35673:return Hg;case 5125:return kg;case 36294:return Gg;case 36295:return Vg;case 36296:return Wg;case 35678:case 36198:case 36298:case 36306:case 35682:return Xg;case 35679:case 36299:case 36307:return Yg;case 35680:case 36300:case 36308:case 36293:return qg;case 36289:case 36303:case 36311:case 36292:return jg}}function Kg(s,e){s.uniform1fv(this.addr,e)}function $g(s,e){const t=_s(e,this.size,2);s.uniform2fv(this.addr,t)}function Qg(s,e){const t=_s(e,this.size,3);s.uniform3fv(this.addr,t)}function Jg(s,e){const t=_s(e,this.size,4);s.uniform4fv(this.addr,t)}function e0(s,e){const t=_s(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function t0(s,e){const t=_s(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function n0(s,e){const t=_s(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function i0(s,e){s.uniform1iv(this.addr,e)}function s0(s,e){s.uniform2iv(this.addr,e)}function r0(s,e){s.uniform3iv(this.addr,e)}function o0(s,e){s.uniform4iv(this.addr,e)}function a0(s,e){s.uniform1uiv(this.addr,e)}function l0(s,e){s.uniform2uiv(this.addr,e)}function c0(s,e){s.uniform3uiv(this.addr,e)}function h0(s,e){s.uniform4uiv(this.addr,e)}function u0(s,e,t){const n=this.cache,i=e.length,r=$r(t,i);Ct(n,r)||(s.uniform1iv(this.addr,r),Lt(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||Jh,r[o])}function d0(s,e,t){const n=this.cache,i=e.length,r=$r(t,i);Ct(n,r)||(s.uniform1iv(this.addr,r),Lt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||nu,r[o])}function f0(s,e,t){const n=this.cache,i=e.length,r=$r(t,i);Ct(n,r)||(s.uniform1iv(this.addr,r),Lt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||iu,r[o])}function p0(s,e,t){const n=this.cache,i=e.length,r=$r(t,i);Ct(n,r)||(s.uniform1iv(this.addr,r),Lt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||tu,r[o])}function m0(s){switch(s){case 5126:return Kg;case 35664:return $g;case 35665:return Qg;case 35666:return Jg;case 35674:return e0;case 35675:return t0;case 35676:return n0;case 5124:case 35670:return i0;case 35667:case 35671:return s0;case 35668:case 35672:return r0;case 35669:case 35673:return o0;case 5125:return a0;case 36294:return l0;case 36295:return c0;case 36296:return h0;case 35678:case 36198:case 36298:case 36306:case 35682:return u0;case 35679:case 36299:case 36307:return d0;case 35680:case 36300:case 36308:case 36293:return f0;case 36289:case 36303:case 36311:case 36292:return p0}}class g0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Zg(t.type)}}class _0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=m0(t.type)}}class v0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(e,t[a.id],n)}}}const No=/(\w+)(\])?(\[|\.)?/g;function dc(s,e){s.seq.push(e),s.map[e.id]=e}function x0(s,e,t){const n=s.name,i=n.length;for(No.lastIndex=0;;){const r=No.exec(n),o=No.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){dc(t,c===void 0?new g0(a,s,e):new _0(a,s,e));break}else{let u=t.map[a];u===void 0&&(u=new v0(a),dc(t,u)),t=u}}}class Nr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);x0(r,o,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function fc(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const M0=37297;let y0=0;function S0(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function E0(s){const e=lt.getPrimaries(lt.workingColorSpace),t=lt.getPrimaries(s);let n;switch(e===t?n="":e===Wr&&t===Vr?n="LinearDisplayP3ToLinearSRGB":e===Vr&&t===Wr&&(n="LinearSRGBToLinearDisplayP3"),s){case zn:case Kr:return[n,"LinearTransferOETF"];case Tt:case Ea:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function pc(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+S0(s.getShaderSource(e),o)}else return i}function b0(s,e){const t=E0(e);return`vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function w0(s,e){let t;switch(e){case Md:t="Linear";break;case yd:t="Reinhard";break;case Sd:t="OptimizedCineon";break;case Ed:t="ACESFilmic";break;case wd:t="AgX";break;case bd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function T0(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(rs).join(`
`)}function A0(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(rs).join(`
`)}function P0(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function R0(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function rs(s){return s!==""}function mc(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function gc(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const C0=/^[ \t]*#include +<([\w\d./]+)>/gm;function ca(s){return s.replace(C0,I0)}const L0=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function I0(s,e){let t=qe[e];if(t===void 0){const n=L0.get(e);if(n!==void 0)t=qe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ca(t)}const D0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _c(s){return s.replace(D0,U0)}function U0(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function vc(s){let e="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function F0(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Lh?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===ju?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Un&&(e="SHADOWMAP_TYPE_VSM"),e}function N0(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case us:case ds:e="ENVMAP_TYPE_CUBE";break;case Zr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function O0(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case ds:e="ENVMAP_MODE_REFRACTION";break}return e}function B0(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case jr:e="ENVMAP_BLENDING_MULTIPLY";break;case vd:e="ENVMAP_BLENDING_MIX";break;case xd:e="ENVMAP_BLENDING_ADD";break}return e}function z0(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function H0(s,e,t,n){const i=s.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=F0(t),c=N0(t),h=O0(t),u=B0(t),d=z0(t),p=t.isWebGL2?"":T0(t),g=A0(t),_=P0(r),m=i.createProgram();let f,x,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(rs).join(`
`),f.length>0&&(f+=`
`),x=[p,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(rs).join(`
`),x.length>0&&(x+=`
`)):(f=[vc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(rs).join(`
`),x=[p,vc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ni?"#define TONE_MAPPING":"",t.toneMapping!==ni?qe.tonemapping_pars_fragment:"",t.toneMapping!==ni?w0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,b0("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(rs).join(`
`)),o=ca(o),o=mc(o,t),o=gc(o,t),a=ca(a),a=mc(a,t),a=gc(a,t),o=_c(o),a=_c(a),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,f=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,x=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===Nl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Nl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const M=v+f+o,y=v+x+a,b=fc(i,i.VERTEX_SHADER,M),w=fc(i,i.FRAGMENT_SHADER,y);i.attachShader(m,b),i.attachShader(m,w),t.index0AttributeName!==void 0?i.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function U(F){if(s.debug.checkShaderErrors){const z=i.getProgramInfoLog(m).trim(),D=i.getShaderInfoLog(b).trim(),O=i.getShaderInfoLog(w).trim();let H=!0,q=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(H=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,m,b,w);else{const K=pc(i,b,"vertex"),j=pc(i,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Program Info Log: `+z+`
`+K+`
`+j)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(D===""||O==="")&&(q=!1);q&&(F.diagnostics={runnable:H,programLog:z,vertexShader:{log:D,prefix:f},fragmentShader:{log:O,prefix:x}})}i.deleteShader(b),i.deleteShader(w),S=new Nr(i,m),E=R0(i,m)}let S;this.getUniforms=function(){return S===void 0&&U(this),S};let E;this.getAttributes=function(){return E===void 0&&U(this),E};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=i.getProgramParameter(m,M0)),L},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=y0++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=w,this}let k0=0;class G0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new V0(e),t.set(e,n)),n}}class V0{constructor(e){this.id=k0++,this.code=e,this.usedTimes=0}}function W0(s,e,t,n,i,r,o){const a=new wa,l=new G0,c=[],h=i.isWebGL2,u=i.logarithmicDepthBuffer,d=i.vertexTextures;let p=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return S===0?"uv":`uv${S}`}function m(S,E,L,F,z){const D=F.fog,O=z.geometry,H=S.isMeshStandardMaterial?F.environment:null,q=(S.isMeshStandardMaterial?t:e).get(S.envMap||H),K=q&&q.mapping===Zr?q.image.height:null,j=g[S.type];S.precision!==null&&(p=i.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const $=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,te=$!==void 0?$.length:0;let se=0;O.morphAttributes.position!==void 0&&(se=1),O.morphAttributes.normal!==void 0&&(se=2),O.morphAttributes.color!==void 0&&(se=3);let V,Q,he,ve;if(j){const St=bn[j];V=St.vertexShader,Q=St.fragmentShader}else V=S.vertexShader,Q=S.fragmentShader,l.update(S),he=l.getVertexShaderID(S),ve=l.getFragmentShaderID(S);const ge=s.getRenderTarget(),Ae=z.isInstancedMesh===!0,Fe=z.isBatchedMesh===!0,Pe=!!S.map,Ye=!!S.matcap,G=!!q,Rt=!!S.aoMap,be=!!S.lightMap,Ue=!!S.bumpMap,Me=!!S.normalMap,at=!!S.displacementMap,ke=!!S.emissiveMap,R=!!S.metalnessMap,T=!!S.roughnessMap,k=S.anisotropy>0,re=S.clearcoat>0,ne=S.iridescence>0,oe=S.sheen>0,ye=S.transmission>0,fe=k&&!!S.anisotropyMap,xe=re&&!!S.clearcoatMap,De=re&&!!S.clearcoatNormalMap,We=re&&!!S.clearcoatRoughnessMap,ee=ne&&!!S.iridescenceMap,rt=ne&&!!S.iridescenceThicknessMap,je=oe&&!!S.sheenColorMap,Be=oe&&!!S.sheenRoughnessMap,we=!!S.specularMap,pe=!!S.specularColorMap,I=!!S.specularIntensityMap,ae=ye&&!!S.transmissionMap,Se=ye&&!!S.thicknessMap,_e=!!S.gradientMap,ie=!!S.alphaMap,N=S.alphaTest>0,le=!!S.alphaHash,de=!!S.extensions,Ne=!!O.attributes.uv1,Ie=!!O.attributes.uv2,et=!!O.attributes.uv3;let tt=ni;return S.toneMapped&&(ge===null||ge.isXRRenderTarget===!0)&&(tt=s.toneMapping),{isWebGL2:h,shaderID:j,shaderType:S.type,shaderName:S.name,vertexShader:V,fragmentShader:Q,defines:S.defines,customVertexShaderID:he,customFragmentShaderID:ve,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:Fe,instancing:Ae,instancingColor:Ae&&z.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:ge===null?s.outputColorSpace:ge.isXRRenderTarget===!0?ge.texture.colorSpace:zn,map:Pe,matcap:Ye,envMap:G,envMapMode:G&&q.mapping,envMapCubeUVHeight:K,aoMap:Rt,lightMap:be,bumpMap:Ue,normalMap:Me,displacementMap:d&&at,emissiveMap:ke,normalMapObjectSpace:Me&&S.normalMapType===zd,normalMapTangentSpace:Me&&S.normalMapType===Sa,metalnessMap:R,roughnessMap:T,anisotropy:k,anisotropyMap:fe,clearcoat:re,clearcoatMap:xe,clearcoatNormalMap:De,clearcoatRoughnessMap:We,iridescence:ne,iridescenceMap:ee,iridescenceThicknessMap:rt,sheen:oe,sheenColorMap:je,sheenRoughnessMap:Be,specularMap:we,specularColorMap:pe,specularIntensityMap:I,transmission:ye,transmissionMap:ae,thicknessMap:Se,gradientMap:_e,opaque:S.transparent===!1&&S.blending===ls,alphaMap:ie,alphaTest:N,alphaHash:le,combine:S.combine,mapUv:Pe&&_(S.map.channel),aoMapUv:Rt&&_(S.aoMap.channel),lightMapUv:be&&_(S.lightMap.channel),bumpMapUv:Ue&&_(S.bumpMap.channel),normalMapUv:Me&&_(S.normalMap.channel),displacementMapUv:at&&_(S.displacementMap.channel),emissiveMapUv:ke&&_(S.emissiveMap.channel),metalnessMapUv:R&&_(S.metalnessMap.channel),roughnessMapUv:T&&_(S.roughnessMap.channel),anisotropyMapUv:fe&&_(S.anisotropyMap.channel),clearcoatMapUv:xe&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:De&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:We&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ee&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:rt&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:je&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:Be&&_(S.sheenRoughnessMap.channel),specularMapUv:we&&_(S.specularMap.channel),specularColorMapUv:pe&&_(S.specularColorMap.channel),specularIntensityMapUv:I&&_(S.specularIntensityMap.channel),transmissionMapUv:ae&&_(S.transmissionMap.channel),thicknessMapUv:Se&&_(S.thicknessMap.channel),alphaMapUv:ie&&_(S.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(Me||k),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,vertexUv1s:Ne,vertexUv2s:Ie,vertexUv3s:et,pointsUvs:z.isPoints===!0&&!!O.attributes.uv&&(Pe||ie),fog:!!D,useFog:S.fog===!0,fogExp2:D&&D.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:z.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:te,morphTextureStride:se,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:tt,useLegacyLights:s._useLegacyLights,decodeVideoTexture:Pe&&S.map.isVideoTexture===!0&&lt.getTransfer(S.map.colorSpace)===ft,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===en,flipSided:S.side===Zt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:de&&S.extensions.derivatives===!0,extensionFragDepth:de&&S.extensions.fragDepth===!0,extensionDrawBuffers:de&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:de&&S.extensions.shaderTextureLOD===!0,extensionClipCullDistance:de&&S.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function f(S){const E=[];if(S.shaderID?E.push(S.shaderID):(E.push(S.customVertexShaderID),E.push(S.customFragmentShaderID)),S.defines!==void 0)for(const L in S.defines)E.push(L),E.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(x(E,S),v(E,S),E.push(s.outputColorSpace)),E.push(S.customProgramCacheKey),E.join()}function x(S,E){S.push(E.precision),S.push(E.outputColorSpace),S.push(E.envMapMode),S.push(E.envMapCubeUVHeight),S.push(E.mapUv),S.push(E.alphaMapUv),S.push(E.lightMapUv),S.push(E.aoMapUv),S.push(E.bumpMapUv),S.push(E.normalMapUv),S.push(E.displacementMapUv),S.push(E.emissiveMapUv),S.push(E.metalnessMapUv),S.push(E.roughnessMapUv),S.push(E.anisotropyMapUv),S.push(E.clearcoatMapUv),S.push(E.clearcoatNormalMapUv),S.push(E.clearcoatRoughnessMapUv),S.push(E.iridescenceMapUv),S.push(E.iridescenceThicknessMapUv),S.push(E.sheenColorMapUv),S.push(E.sheenRoughnessMapUv),S.push(E.specularMapUv),S.push(E.specularColorMapUv),S.push(E.specularIntensityMapUv),S.push(E.transmissionMapUv),S.push(E.thicknessMapUv),S.push(E.combine),S.push(E.fogExp2),S.push(E.sizeAttenuation),S.push(E.morphTargetsCount),S.push(E.morphAttributeCount),S.push(E.numDirLights),S.push(E.numPointLights),S.push(E.numSpotLights),S.push(E.numSpotLightMaps),S.push(E.numHemiLights),S.push(E.numRectAreaLights),S.push(E.numDirLightShadows),S.push(E.numPointLightShadows),S.push(E.numSpotLightShadows),S.push(E.numSpotLightShadowsWithMaps),S.push(E.numLightProbes),S.push(E.shadowMapType),S.push(E.toneMapping),S.push(E.numClippingPlanes),S.push(E.numClipIntersection),S.push(E.depthPacking)}function v(S,E){a.disableAll(),E.isWebGL2&&a.enable(0),E.supportsVertexTextures&&a.enable(1),E.instancing&&a.enable(2),E.instancingColor&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),S.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.skinning&&a.enable(4),E.morphTargets&&a.enable(5),E.morphNormals&&a.enable(6),E.morphColors&&a.enable(7),E.premultipliedAlpha&&a.enable(8),E.shadowMapEnabled&&a.enable(9),E.useLegacyLights&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),S.push(a.mask)}function M(S){const E=g[S.type];let L;if(E){const F=bn[E];L=Tf.clone(F.uniforms)}else L=S.uniforms;return L}function y(S,E){let L;for(let F=0,z=c.length;F<z;F++){const D=c[F];if(D.cacheKey===E){L=D,++L.usedTimes;break}}return L===void 0&&(L=new H0(s,E,S,r),c.push(L)),L}function b(S){if(--S.usedTimes===0){const E=c.indexOf(S);c[E]=c[c.length-1],c.pop(),S.destroy()}}function w(S){l.remove(S)}function U(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:M,acquireProgram:y,releaseProgram:b,releaseShaderCache:w,programs:c,dispose:U}}function X0(){let s=new WeakMap;function e(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function t(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function Y0(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function xc(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Mc(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(u,d,p,g,_,m){let f=s[e];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},s[e]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=m),e++,f}function a(u,d,p,g,_,m){const f=o(u,d,p,g,_,m);p.transmission>0?n.push(f):p.transparent===!0?i.push(f):t.push(f)}function l(u,d,p,g,_,m){const f=o(u,d,p,g,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?i.unshift(f):t.unshift(f)}function c(u,d){t.length>1&&t.sort(u||Y0),n.length>1&&n.sort(d||xc),i.length>1&&i.sort(d||xc)}function h(){for(let u=e,d=s.length;u<d;u++){const p=s[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function q0(){let s=new WeakMap;function e(n,i){const r=s.get(n);let o;return r===void 0?(o=new Mc,s.set(n,[o])):i>=r.length?(o=new Mc,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function j0(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new C,color:new He};break;case"SpotLight":t={position:new C,direction:new C,color:new He,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new He,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new He,groundColor:new He};break;case"RectAreaLight":t={color:new He,position:new C,halfWidth:new C,halfHeight:new C};break}return s[e.id]=t,t}}}function Z0(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let K0=0;function $0(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Q0(s,e){const t=new j0,n=Z0(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new C);const r=new C,o=new Te,a=new Te;function l(h,u){let d=0,p=0,g=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let _=0,m=0,f=0,x=0,v=0,M=0,y=0,b=0,w=0,U=0,S=0;h.sort($0);const E=u===!0?Math.PI:1;for(let F=0,z=h.length;F<z;F++){const D=h[F],O=D.color,H=D.intensity,q=D.distance,K=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)d+=O.r*H*E,p+=O.g*H*E,g+=O.b*H*E;else if(D.isLightProbe){for(let j=0;j<9;j++)i.probe[j].addScaledVector(D.sh.coefficients[j],H);S++}else if(D.isDirectionalLight){const j=t.get(D);if(j.color.copy(D.color).multiplyScalar(D.intensity*E),D.castShadow){const $=D.shadow,te=n.get(D);te.shadowBias=$.bias,te.shadowNormalBias=$.normalBias,te.shadowRadius=$.radius,te.shadowMapSize=$.mapSize,i.directionalShadow[_]=te,i.directionalShadowMap[_]=K,i.directionalShadowMatrix[_]=D.shadow.matrix,M++}i.directional[_]=j,_++}else if(D.isSpotLight){const j=t.get(D);j.position.setFromMatrixPosition(D.matrixWorld),j.color.copy(O).multiplyScalar(H*E),j.distance=q,j.coneCos=Math.cos(D.angle),j.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),j.decay=D.decay,i.spot[f]=j;const $=D.shadow;if(D.map&&(i.spotLightMap[w]=D.map,w++,$.updateMatrices(D),D.castShadow&&U++),i.spotLightMatrix[f]=$.matrix,D.castShadow){const te=n.get(D);te.shadowBias=$.bias,te.shadowNormalBias=$.normalBias,te.shadowRadius=$.radius,te.shadowMapSize=$.mapSize,i.spotShadow[f]=te,i.spotShadowMap[f]=K,b++}f++}else if(D.isRectAreaLight){const j=t.get(D);j.color.copy(O).multiplyScalar(H),j.halfWidth.set(D.width*.5,0,0),j.halfHeight.set(0,D.height*.5,0),i.rectArea[x]=j,x++}else if(D.isPointLight){const j=t.get(D);if(j.color.copy(D.color).multiplyScalar(D.intensity*E),j.distance=D.distance,j.decay=D.decay,D.castShadow){const $=D.shadow,te=n.get(D);te.shadowBias=$.bias,te.shadowNormalBias=$.normalBias,te.shadowRadius=$.radius,te.shadowMapSize=$.mapSize,te.shadowCameraNear=$.camera.near,te.shadowCameraFar=$.camera.far,i.pointShadow[m]=te,i.pointShadowMap[m]=K,i.pointShadowMatrix[m]=D.shadow.matrix,y++}i.point[m]=j,m++}else if(D.isHemisphereLight){const j=t.get(D);j.skyColor.copy(D.color).multiplyScalar(H*E),j.groundColor.copy(D.groundColor).multiplyScalar(H*E),i.hemi[v]=j,v++}}x>0&&(e.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=d,i.ambient[1]=p,i.ambient[2]=g;const L=i.hash;(L.directionalLength!==_||L.pointLength!==m||L.spotLength!==f||L.rectAreaLength!==x||L.hemiLength!==v||L.numDirectionalShadows!==M||L.numPointShadows!==y||L.numSpotShadows!==b||L.numSpotMaps!==w||L.numLightProbes!==S)&&(i.directional.length=_,i.spot.length=f,i.rectArea.length=x,i.point.length=m,i.hemi.length=v,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=b+w-U,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=U,i.numLightProbes=S,L.directionalLength=_,L.pointLength=m,L.spotLength=f,L.rectAreaLength=x,L.hemiLength=v,L.numDirectionalShadows=M,L.numPointShadows=y,L.numSpotShadows=b,L.numSpotMaps=w,L.numLightProbes=S,i.version=K0++)}function c(h,u){let d=0,p=0,g=0,_=0,m=0;const f=u.matrixWorldInverse;for(let x=0,v=h.length;x<v;x++){const M=h[x];if(M.isDirectionalLight){const y=i.directional[d];y.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(f),d++}else if(M.isSpotLight){const y=i.spot[g];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(f),y.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(f),g++}else if(M.isRectAreaLight){const y=i.rectArea[_];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(f),a.identity(),o.copy(M.matrixWorld),o.premultiply(f),a.extractRotation(o),y.halfWidth.set(M.width*.5,0,0),y.halfHeight.set(0,M.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),_++}else if(M.isPointLight){const y=i.point[p];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(f),p++}else if(M.isHemisphereLight){const y=i.hemi[m];y.direction.setFromMatrixPosition(M.matrixWorld),y.direction.transformDirection(f),m++}}}return{setup:l,setupView:c,state:i}}function yc(s,e){const t=new Q0(s,e),n=[],i=[];function r(){n.length=0,i.length=0}function o(u){n.push(u)}function a(u){i.push(u)}function l(u){t.setup(n,u)}function c(u){t.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function J0(s,e){let t=new WeakMap;function n(r,o=0){const a=t.get(r);let l;return a===void 0?(l=new yc(s,e),t.set(r,[l])):o>=a.length?(l=new yc(s,e),a.push(l)):l=a[o],l}function i(){t=new WeakMap}return{get:n,dispose:i}}class e_ extends Ii{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Od,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class t_ extends Ii{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const n_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,i_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function s_(s,e,t){let n=new Aa;const i=new Le,r=new Le,o=new ot,a=new e_({depthPacking:Bd}),l=new t_,c={},h=t.maxTextureSize,u={[si]:Zt,[Zt]:si,[en]:en},d=new wi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Le},radius:{value:4}},vertexShader:n_,fragmentShader:i_}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new yt;g.setAttribute("position",new Mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ce(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Lh;let f=this.type;this.render=function(b,w,U){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;const S=s.getRenderTarget(),E=s.getActiveCubeFace(),L=s.getActiveMipmapLevel(),F=s.state;F.setBlending(ti),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=f!==Un&&this.type===Un,D=f===Un&&this.type!==Un;for(let O=0,H=b.length;O<H;O++){const q=b[O],K=q.shadow;if(K===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(K.autoUpdate===!1&&K.needsUpdate===!1)continue;i.copy(K.mapSize);const j=K.getFrameExtents();if(i.multiply(j),r.copy(K.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/j.x),i.x=r.x*j.x,K.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/j.y),i.y=r.y*j.y,K.mapSize.y=r.y)),K.map===null||z===!0||D===!0){const te=this.type!==Un?{minFilter:Ot,magFilter:Ot}:{};K.map!==null&&K.map.dispose(),K.map=new bi(i.x,i.y,te),K.map.texture.name=q.name+".shadowMap",K.camera.updateProjectionMatrix()}s.setRenderTarget(K.map),s.clear();const $=K.getViewportCount();for(let te=0;te<$;te++){const se=K.getViewport(te);o.set(r.x*se.x,r.y*se.y,r.x*se.z,r.y*se.w),F.viewport(o),K.updateMatrices(q,te),n=K.getFrustum(),M(w,U,K.camera,q,this.type)}K.isPointLightShadow!==!0&&this.type===Un&&x(K,U),K.needsUpdate=!1}f=this.type,m.needsUpdate=!1,s.setRenderTarget(S,E,L)};function x(b,w){const U=e.update(_);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,p.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new bi(i.x,i.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,s.setRenderTarget(b.mapPass),s.clear(),s.renderBufferDirect(w,null,U,d,_,null),p.uniforms.shadow_pass.value=b.mapPass.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,s.setRenderTarget(b.map),s.clear(),s.renderBufferDirect(w,null,U,p,_,null)}function v(b,w,U,S){let E=null;const L=U.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(L!==void 0)E=L;else if(E=U.isPointLight===!0?l:a,s.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const F=E.uuid,z=w.uuid;let D=c[F];D===void 0&&(D={},c[F]=D);let O=D[z];O===void 0&&(O=E.clone(),D[z]=O,w.addEventListener("dispose",y)),E=O}if(E.visible=w.visible,E.wireframe=w.wireframe,S===Un?E.side=w.shadowSide!==null?w.shadowSide:w.side:E.side=w.shadowSide!==null?w.shadowSide:u[w.side],E.alphaMap=w.alphaMap,E.alphaTest=w.alphaTest,E.map=w.map,E.clipShadows=w.clipShadows,E.clippingPlanes=w.clippingPlanes,E.clipIntersection=w.clipIntersection,E.displacementMap=w.displacementMap,E.displacementScale=w.displacementScale,E.displacementBias=w.displacementBias,E.wireframeLinewidth=w.wireframeLinewidth,E.linewidth=w.linewidth,U.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const F=s.properties.get(E);F.light=U}return E}function M(b,w,U,S,E){if(b.visible===!1)return;if(b.layers.test(w.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&E===Un)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,b.matrixWorld);const z=e.update(b),D=b.material;if(Array.isArray(D)){const O=z.groups;for(let H=0,q=O.length;H<q;H++){const K=O[H],j=D[K.materialIndex];if(j&&j.visible){const $=v(b,j,S,E);b.onBeforeShadow(s,b,w,U,z,$,K),s.renderBufferDirect(U,null,z,$,b,K),b.onAfterShadow(s,b,w,U,z,$,K)}}}else if(D.visible){const O=v(b,D,S,E);b.onBeforeShadow(s,b,w,U,z,O,null),s.renderBufferDirect(U,null,z,O,b,null),b.onAfterShadow(s,b,w,U,z,O,null)}}const F=b.children;for(let z=0,D=F.length;z<D;z++)M(F[z],w,U,S,E)}function y(b){b.target.removeEventListener("dispose",y);for(const U in c){const S=c[U],E=b.target.uuid;E in S&&(S[E].dispose(),delete S[E])}}}function r_(s,e,t){const n=t.isWebGL2;function i(){let N=!1;const le=new ot;let de=null;const Ne=new ot(0,0,0,0);return{setMask:function(Ie){de!==Ie&&!N&&(s.colorMask(Ie,Ie,Ie,Ie),de=Ie)},setLocked:function(Ie){N=Ie},setClear:function(Ie,et,tt,xt,St){St===!0&&(Ie*=xt,et*=xt,tt*=xt),le.set(Ie,et,tt,xt),Ne.equals(le)===!1&&(s.clearColor(Ie,et,tt,xt),Ne.copy(le))},reset:function(){N=!1,de=null,Ne.set(-1,0,0,0)}}}function r(){let N=!1,le=null,de=null,Ne=null;return{setTest:function(Ie){Ie?Fe(s.DEPTH_TEST):Pe(s.DEPTH_TEST)},setMask:function(Ie){le!==Ie&&!N&&(s.depthMask(Ie),le=Ie)},setFunc:function(Ie){if(de!==Ie){switch(Ie){case ud:s.depthFunc(s.NEVER);break;case dd:s.depthFunc(s.ALWAYS);break;case fd:s.depthFunc(s.LESS);break;case Br:s.depthFunc(s.LEQUAL);break;case pd:s.depthFunc(s.EQUAL);break;case md:s.depthFunc(s.GEQUAL);break;case gd:s.depthFunc(s.GREATER);break;case _d:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}de=Ie}},setLocked:function(Ie){N=Ie},setClear:function(Ie){Ne!==Ie&&(s.clearDepth(Ie),Ne=Ie)},reset:function(){N=!1,le=null,de=null,Ne=null}}}function o(){let N=!1,le=null,de=null,Ne=null,Ie=null,et=null,tt=null,xt=null,St=null;return{setTest:function(it){N||(it?Fe(s.STENCIL_TEST):Pe(s.STENCIL_TEST))},setMask:function(it){le!==it&&!N&&(s.stencilMask(it),le=it)},setFunc:function(it,At,Sn){(de!==it||Ne!==At||Ie!==Sn)&&(s.stencilFunc(it,At,Sn),de=it,Ne=At,Ie=Sn)},setOp:function(it,At,Sn){(et!==it||tt!==At||xt!==Sn)&&(s.stencilOp(it,At,Sn),et=it,tt=At,xt=Sn)},setLocked:function(it){N=it},setClear:function(it){St!==it&&(s.clearStencil(it),St=it)},reset:function(){N=!1,le=null,de=null,Ne=null,Ie=null,et=null,tt=null,xt=null,St=null}}}const a=new i,l=new r,c=new o,h=new WeakMap,u=new WeakMap;let d={},p={},g=new WeakMap,_=[],m=null,f=!1,x=null,v=null,M=null,y=null,b=null,w=null,U=null,S=new He(0,0,0),E=0,L=!1,F=null,z=null,D=null,O=null,H=null;const q=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,j=0;const $=s.getParameter(s.VERSION);$.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec($)[1]),K=j>=1):$.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),K=j>=2);let te=null,se={};const V=s.getParameter(s.SCISSOR_BOX),Q=s.getParameter(s.VIEWPORT),he=new ot().fromArray(V),ve=new ot().fromArray(Q);function ge(N,le,de,Ne){const Ie=new Uint8Array(4),et=s.createTexture();s.bindTexture(N,et),s.texParameteri(N,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(N,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let tt=0;tt<de;tt++)n&&(N===s.TEXTURE_3D||N===s.TEXTURE_2D_ARRAY)?s.texImage3D(le,0,s.RGBA,1,1,Ne,0,s.RGBA,s.UNSIGNED_BYTE,Ie):s.texImage2D(le+tt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Ie);return et}const Ae={};Ae[s.TEXTURE_2D]=ge(s.TEXTURE_2D,s.TEXTURE_2D,1),Ae[s.TEXTURE_CUBE_MAP]=ge(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Ae[s.TEXTURE_2D_ARRAY]=ge(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Ae[s.TEXTURE_3D]=ge(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Fe(s.DEPTH_TEST),l.setFunc(Br),ke(!1),R(Qa),Fe(s.CULL_FACE),Me(ti);function Fe(N){d[N]!==!0&&(s.enable(N),d[N]=!0)}function Pe(N){d[N]!==!1&&(s.disable(N),d[N]=!1)}function Ye(N,le){return p[N]!==le?(s.bindFramebuffer(N,le),p[N]=le,n&&(N===s.DRAW_FRAMEBUFFER&&(p[s.FRAMEBUFFER]=le),N===s.FRAMEBUFFER&&(p[s.DRAW_FRAMEBUFFER]=le)),!0):!1}function G(N,le){let de=_,Ne=!1;if(N)if(de=g.get(le),de===void 0&&(de=[],g.set(le,de)),N.isWebGLMultipleRenderTargets){const Ie=N.texture;if(de.length!==Ie.length||de[0]!==s.COLOR_ATTACHMENT0){for(let et=0,tt=Ie.length;et<tt;et++)de[et]=s.COLOR_ATTACHMENT0+et;de.length=Ie.length,Ne=!0}}else de[0]!==s.COLOR_ATTACHMENT0&&(de[0]=s.COLOR_ATTACHMENT0,Ne=!0);else de[0]!==s.BACK&&(de[0]=s.BACK,Ne=!0);Ne&&(t.isWebGL2?s.drawBuffers(de):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(de))}function Rt(N){return m!==N?(s.useProgram(N),m=N,!0):!1}const be={[mi]:s.FUNC_ADD,[Ku]:s.FUNC_SUBTRACT,[$u]:s.FUNC_REVERSE_SUBTRACT};if(n)be[nl]=s.MIN,be[il]=s.MAX;else{const N=e.get("EXT_blend_minmax");N!==null&&(be[nl]=N.MIN_EXT,be[il]=N.MAX_EXT)}const Ue={[Qu]:s.ZERO,[Ju]:s.ONE,[ed]:s.SRC_COLOR,[ia]:s.SRC_ALPHA,[od]:s.SRC_ALPHA_SATURATE,[sd]:s.DST_COLOR,[nd]:s.DST_ALPHA,[td]:s.ONE_MINUS_SRC_COLOR,[sa]:s.ONE_MINUS_SRC_ALPHA,[rd]:s.ONE_MINUS_DST_COLOR,[id]:s.ONE_MINUS_DST_ALPHA,[ad]:s.CONSTANT_COLOR,[ld]:s.ONE_MINUS_CONSTANT_COLOR,[cd]:s.CONSTANT_ALPHA,[hd]:s.ONE_MINUS_CONSTANT_ALPHA};function Me(N,le,de,Ne,Ie,et,tt,xt,St,it){if(N===ti){f===!0&&(Pe(s.BLEND),f=!1);return}if(f===!1&&(Fe(s.BLEND),f=!0),N!==Zu){if(N!==x||it!==L){if((v!==mi||b!==mi)&&(s.blendEquation(s.FUNC_ADD),v=mi,b=mi),it)switch(N){case ls:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ja:s.blendFunc(s.ONE,s.ONE);break;case el:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case tl:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case ls:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ja:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case el:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case tl:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}M=null,y=null,w=null,U=null,S.set(0,0,0),E=0,x=N,L=it}return}Ie=Ie||le,et=et||de,tt=tt||Ne,(le!==v||Ie!==b)&&(s.blendEquationSeparate(be[le],be[Ie]),v=le,b=Ie),(de!==M||Ne!==y||et!==w||tt!==U)&&(s.blendFuncSeparate(Ue[de],Ue[Ne],Ue[et],Ue[tt]),M=de,y=Ne,w=et,U=tt),(xt.equals(S)===!1||St!==E)&&(s.blendColor(xt.r,xt.g,xt.b,St),S.copy(xt),E=St),x=N,L=!1}function at(N,le){N.side===en?Pe(s.CULL_FACE):Fe(s.CULL_FACE);let de=N.side===Zt;le&&(de=!de),ke(de),N.blending===ls&&N.transparent===!1?Me(ti):Me(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),l.setFunc(N.depthFunc),l.setTest(N.depthTest),l.setMask(N.depthWrite),a.setMask(N.colorWrite);const Ne=N.stencilWrite;c.setTest(Ne),Ne&&(c.setMask(N.stencilWriteMask),c.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),c.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),k(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?Fe(s.SAMPLE_ALPHA_TO_COVERAGE):Pe(s.SAMPLE_ALPHA_TO_COVERAGE)}function ke(N){F!==N&&(N?s.frontFace(s.CW):s.frontFace(s.CCW),F=N)}function R(N){N!==Xu?(Fe(s.CULL_FACE),N!==z&&(N===Qa?s.cullFace(s.BACK):N===Yu?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Pe(s.CULL_FACE),z=N}function T(N){N!==D&&(K&&s.lineWidth(N),D=N)}function k(N,le,de){N?(Fe(s.POLYGON_OFFSET_FILL),(O!==le||H!==de)&&(s.polygonOffset(le,de),O=le,H=de)):Pe(s.POLYGON_OFFSET_FILL)}function re(N){N?Fe(s.SCISSOR_TEST):Pe(s.SCISSOR_TEST)}function ne(N){N===void 0&&(N=s.TEXTURE0+q-1),te!==N&&(s.activeTexture(N),te=N)}function oe(N,le,de){de===void 0&&(te===null?de=s.TEXTURE0+q-1:de=te);let Ne=se[de];Ne===void 0&&(Ne={type:void 0,texture:void 0},se[de]=Ne),(Ne.type!==N||Ne.texture!==le)&&(te!==de&&(s.activeTexture(de),te=de),s.bindTexture(N,le||Ae[N]),Ne.type=N,Ne.texture=le)}function ye(){const N=se[te];N!==void 0&&N.type!==void 0&&(s.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function fe(){try{s.compressedTexImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function xe(){try{s.compressedTexImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function De(){try{s.texSubImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function We(){try{s.texSubImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ee(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function rt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function je(){try{s.texStorage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Be(){try{s.texStorage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function we(){try{s.texImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function pe(){try{s.texImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function I(N){he.equals(N)===!1&&(s.scissor(N.x,N.y,N.z,N.w),he.copy(N))}function ae(N){ve.equals(N)===!1&&(s.viewport(N.x,N.y,N.z,N.w),ve.copy(N))}function Se(N,le){let de=u.get(le);de===void 0&&(de=new WeakMap,u.set(le,de));let Ne=de.get(N);Ne===void 0&&(Ne=s.getUniformBlockIndex(le,N.name),de.set(N,Ne))}function _e(N,le){const Ne=u.get(le).get(N);h.get(le)!==Ne&&(s.uniformBlockBinding(le,Ne,N.__bindingPointIndex),h.set(le,Ne))}function ie(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),d={},te=null,se={},p={},g=new WeakMap,_=[],m=null,f=!1,x=null,v=null,M=null,y=null,b=null,w=null,U=null,S=new He(0,0,0),E=0,L=!1,F=null,z=null,D=null,O=null,H=null,he.set(0,0,s.canvas.width,s.canvas.height),ve.set(0,0,s.canvas.width,s.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:Fe,disable:Pe,bindFramebuffer:Ye,drawBuffers:G,useProgram:Rt,setBlending:Me,setMaterial:at,setFlipSided:ke,setCullFace:R,setLineWidth:T,setPolygonOffset:k,setScissorTest:re,activeTexture:ne,bindTexture:oe,unbindTexture:ye,compressedTexImage2D:fe,compressedTexImage3D:xe,texImage2D:we,texImage3D:pe,updateUBOMapping:Se,uniformBlockBinding:_e,texStorage2D:je,texStorage3D:Be,texSubImage2D:De,texSubImage3D:We,compressedTexSubImage2D:ee,compressedTexSubImage3D:rt,scissor:I,viewport:ae,reset:ie}}function o_(s,e,t,n,i,r,o){const a=i.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,T){return p?new OffscreenCanvas(R,T):Hs("canvas")}function _(R,T,k,re){let ne=1;if((R.width>re||R.height>re)&&(ne=re/Math.max(R.width,R.height)),ne<1||T===!0)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap){const oe=T?Yr:Math.floor,ye=oe(ne*R.width),fe=oe(ne*R.height);u===void 0&&(u=g(ye,fe));const xe=k?g(ye,fe):u;return xe.width=ye,xe.height=fe,xe.getContext("2d").drawImage(R,0,0,ye,fe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+R.width+"x"+R.height+") to ("+ye+"x"+fe+")."),xe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+R.width+"x"+R.height+")."),R;return R}function m(R){return la(R.width)&&la(R.height)}function f(R){return a?!1:R.wrapS!==tn||R.wrapT!==tn||R.minFilter!==Ot&&R.minFilter!==ln}function x(R,T){return R.generateMipmaps&&T&&R.minFilter!==Ot&&R.minFilter!==ln}function v(R){s.generateMipmap(R)}function M(R,T,k,re,ne=!1){if(a===!1)return T;if(R!==null){if(s[R]!==void 0)return s[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let oe=T;if(T===s.RED&&(k===s.FLOAT&&(oe=s.R32F),k===s.HALF_FLOAT&&(oe=s.R16F),k===s.UNSIGNED_BYTE&&(oe=s.R8)),T===s.RED_INTEGER&&(k===s.UNSIGNED_BYTE&&(oe=s.R8UI),k===s.UNSIGNED_SHORT&&(oe=s.R16UI),k===s.UNSIGNED_INT&&(oe=s.R32UI),k===s.BYTE&&(oe=s.R8I),k===s.SHORT&&(oe=s.R16I),k===s.INT&&(oe=s.R32I)),T===s.RG&&(k===s.FLOAT&&(oe=s.RG32F),k===s.HALF_FLOAT&&(oe=s.RG16F),k===s.UNSIGNED_BYTE&&(oe=s.RG8)),T===s.RGBA){const ye=ne?Gr:lt.getTransfer(re);k===s.FLOAT&&(oe=s.RGBA32F),k===s.HALF_FLOAT&&(oe=s.RGBA16F),k===s.UNSIGNED_BYTE&&(oe=ye===ft?s.SRGB8_ALPHA8:s.RGBA8),k===s.UNSIGNED_SHORT_4_4_4_4&&(oe=s.RGBA4),k===s.UNSIGNED_SHORT_5_5_5_1&&(oe=s.RGB5_A1)}return(oe===s.R16F||oe===s.R32F||oe===s.RG16F||oe===s.RG32F||oe===s.RGBA16F||oe===s.RGBA32F)&&e.get("EXT_color_buffer_float"),oe}function y(R,T,k){return x(R,k)===!0||R.isFramebufferTexture&&R.minFilter!==Ot&&R.minFilter!==ln?Math.log2(Math.max(T.width,T.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?T.mipmaps.length:1}function b(R){return R===Ot||R===rl||R===ao?s.NEAREST:s.LINEAR}function w(R){const T=R.target;T.removeEventListener("dispose",w),S(T),T.isVideoTexture&&h.delete(T)}function U(R){const T=R.target;T.removeEventListener("dispose",U),L(T)}function S(R){const T=n.get(R);if(T.__webglInit===void 0)return;const k=R.source,re=d.get(k);if(re){const ne=re[T.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&E(R),Object.keys(re).length===0&&d.delete(k)}n.remove(R)}function E(R){const T=n.get(R);s.deleteTexture(T.__webglTexture);const k=R.source,re=d.get(k);delete re[T.__cacheKey],o.memory.textures--}function L(R){const T=R.texture,k=n.get(R),re=n.get(T);if(re.__webglTexture!==void 0&&(s.deleteTexture(re.__webglTexture),o.memory.textures--),R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(k.__webglFramebuffer[ne]))for(let oe=0;oe<k.__webglFramebuffer[ne].length;oe++)s.deleteFramebuffer(k.__webglFramebuffer[ne][oe]);else s.deleteFramebuffer(k.__webglFramebuffer[ne]);k.__webglDepthbuffer&&s.deleteRenderbuffer(k.__webglDepthbuffer[ne])}else{if(Array.isArray(k.__webglFramebuffer))for(let ne=0;ne<k.__webglFramebuffer.length;ne++)s.deleteFramebuffer(k.__webglFramebuffer[ne]);else s.deleteFramebuffer(k.__webglFramebuffer);if(k.__webglDepthbuffer&&s.deleteRenderbuffer(k.__webglDepthbuffer),k.__webglMultisampledFramebuffer&&s.deleteFramebuffer(k.__webglMultisampledFramebuffer),k.__webglColorRenderbuffer)for(let ne=0;ne<k.__webglColorRenderbuffer.length;ne++)k.__webglColorRenderbuffer[ne]&&s.deleteRenderbuffer(k.__webglColorRenderbuffer[ne]);k.__webglDepthRenderbuffer&&s.deleteRenderbuffer(k.__webglDepthRenderbuffer)}if(R.isWebGLMultipleRenderTargets)for(let ne=0,oe=T.length;ne<oe;ne++){const ye=n.get(T[ne]);ye.__webglTexture&&(s.deleteTexture(ye.__webglTexture),o.memory.textures--),n.remove(T[ne])}n.remove(T),n.remove(R)}let F=0;function z(){F=0}function D(){const R=F;return R>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+i.maxTextures),F+=1,R}function O(R){const T=[];return T.push(R.wrapS),T.push(R.wrapT),T.push(R.wrapR||0),T.push(R.magFilter),T.push(R.minFilter),T.push(R.anisotropy),T.push(R.internalFormat),T.push(R.format),T.push(R.type),T.push(R.generateMipmaps),T.push(R.premultiplyAlpha),T.push(R.flipY),T.push(R.unpackAlignment),T.push(R.colorSpace),T.join()}function H(R,T){const k=n.get(R);if(R.isVideoTexture&&at(R),R.isRenderTargetTexture===!1&&R.version>0&&k.__version!==R.version){const re=R.image;if(re===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{he(k,R,T);return}}t.bindTexture(s.TEXTURE_2D,k.__webglTexture,s.TEXTURE0+T)}function q(R,T){const k=n.get(R);if(R.version>0&&k.__version!==R.version){he(k,R,T);return}t.bindTexture(s.TEXTURE_2D_ARRAY,k.__webglTexture,s.TEXTURE0+T)}function K(R,T){const k=n.get(R);if(R.version>0&&k.__version!==R.version){he(k,R,T);return}t.bindTexture(s.TEXTURE_3D,k.__webglTexture,s.TEXTURE0+T)}function j(R,T){const k=n.get(R);if(R.version>0&&k.__version!==R.version){ve(k,R,T);return}t.bindTexture(s.TEXTURE_CUBE_MAP,k.__webglTexture,s.TEXTURE0+T)}const $={[Os]:s.REPEAT,[tn]:s.CLAMP_TO_EDGE,[oa]:s.MIRRORED_REPEAT},te={[Ot]:s.NEAREST,[rl]:s.NEAREST_MIPMAP_NEAREST,[ao]:s.NEAREST_MIPMAP_LINEAR,[ln]:s.LINEAR,[Ad]:s.LINEAR_MIPMAP_NEAREST,[Bs]:s.LINEAR_MIPMAP_LINEAR},se={[Hd]:s.NEVER,[Yd]:s.ALWAYS,[kd]:s.LESS,[kh]:s.LEQUAL,[Gd]:s.EQUAL,[Xd]:s.GEQUAL,[Vd]:s.GREATER,[Wd]:s.NOTEQUAL};function V(R,T,k){if(k?(s.texParameteri(R,s.TEXTURE_WRAP_S,$[T.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,$[T.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,$[T.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,te[T.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,te[T.minFilter])):(s.texParameteri(R,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(R,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(T.wrapS!==tn||T.wrapT!==tn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(R,s.TEXTURE_MAG_FILTER,b(T.magFilter)),s.texParameteri(R,s.TEXTURE_MIN_FILTER,b(T.minFilter)),T.minFilter!==Ot&&T.minFilter!==ln&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),T.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,se[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const re=e.get("EXT_texture_filter_anisotropic");if(T.magFilter===Ot||T.minFilter!==ao&&T.minFilter!==Bs||T.type===Nn&&e.has("OES_texture_float_linear")===!1||a===!1&&T.type===zs&&e.has("OES_texture_half_float_linear")===!1)return;(T.anisotropy>1||n.get(T).__currentAnisotropy)&&(s.texParameterf(R,re.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,i.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy)}}function Q(R,T){let k=!1;R.__webglInit===void 0&&(R.__webglInit=!0,T.addEventListener("dispose",w));const re=T.source;let ne=d.get(re);ne===void 0&&(ne={},d.set(re,ne));const oe=O(T);if(oe!==R.__cacheKey){ne[oe]===void 0&&(ne[oe]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,k=!0),ne[oe].usedTimes++;const ye=ne[R.__cacheKey];ye!==void 0&&(ne[R.__cacheKey].usedTimes--,ye.usedTimes===0&&E(T)),R.__cacheKey=oe,R.__webglTexture=ne[oe].texture}return k}function he(R,T,k){let re=s.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(re=s.TEXTURE_2D_ARRAY),T.isData3DTexture&&(re=s.TEXTURE_3D);const ne=Q(R,T),oe=T.source;t.bindTexture(re,R.__webglTexture,s.TEXTURE0+k);const ye=n.get(oe);if(oe.version!==ye.__version||ne===!0){t.activeTexture(s.TEXTURE0+k);const fe=lt.getPrimaries(lt.workingColorSpace),xe=T.colorSpace===un?null:lt.getPrimaries(T.colorSpace),De=T.colorSpace===un||fe===xe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);const We=f(T)&&m(T.image)===!1;let ee=_(T.image,We,!1,i.maxTextureSize);ee=ke(T,ee);const rt=m(ee)||a,je=r.convert(T.format,T.colorSpace);let Be=r.convert(T.type),we=M(T.internalFormat,je,Be,T.colorSpace,T.isVideoTexture);V(re,T,rt);let pe;const I=T.mipmaps,ae=a&&T.isVideoTexture!==!0&&we!==zh,Se=ye.__version===void 0||ne===!0,_e=y(T,ee,rt);if(T.isDepthTexture)we=s.DEPTH_COMPONENT,a?T.type===Nn?we=s.DEPTH_COMPONENT32F:T.type===Zn?we=s.DEPTH_COMPONENT24:T.type===vi?we=s.DEPTH24_STENCIL8:we=s.DEPTH_COMPONENT16:T.type===Nn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),T.format===xi&&we===s.DEPTH_COMPONENT&&T.type!==ya&&T.type!==Zn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),T.type=Zn,Be=r.convert(T.type)),T.format===fs&&we===s.DEPTH_COMPONENT&&(we=s.DEPTH_STENCIL,T.type!==vi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),T.type=vi,Be=r.convert(T.type))),Se&&(ae?t.texStorage2D(s.TEXTURE_2D,1,we,ee.width,ee.height):t.texImage2D(s.TEXTURE_2D,0,we,ee.width,ee.height,0,je,Be,null));else if(T.isDataTexture)if(I.length>0&&rt){ae&&Se&&t.texStorage2D(s.TEXTURE_2D,_e,we,I[0].width,I[0].height);for(let ie=0,N=I.length;ie<N;ie++)pe=I[ie],ae?t.texSubImage2D(s.TEXTURE_2D,ie,0,0,pe.width,pe.height,je,Be,pe.data):t.texImage2D(s.TEXTURE_2D,ie,we,pe.width,pe.height,0,je,Be,pe.data);T.generateMipmaps=!1}else ae?(Se&&t.texStorage2D(s.TEXTURE_2D,_e,we,ee.width,ee.height),t.texSubImage2D(s.TEXTURE_2D,0,0,0,ee.width,ee.height,je,Be,ee.data)):t.texImage2D(s.TEXTURE_2D,0,we,ee.width,ee.height,0,je,Be,ee.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){ae&&Se&&t.texStorage3D(s.TEXTURE_2D_ARRAY,_e,we,I[0].width,I[0].height,ee.depth);for(let ie=0,N=I.length;ie<N;ie++)pe=I[ie],T.format!==hn?je!==null?ae?t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ie,0,0,0,pe.width,pe.height,ee.depth,je,pe.data,0,0):t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ie,we,pe.width,pe.height,ee.depth,0,pe.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ae?t.texSubImage3D(s.TEXTURE_2D_ARRAY,ie,0,0,0,pe.width,pe.height,ee.depth,je,Be,pe.data):t.texImage3D(s.TEXTURE_2D_ARRAY,ie,we,pe.width,pe.height,ee.depth,0,je,Be,pe.data)}else{ae&&Se&&t.texStorage2D(s.TEXTURE_2D,_e,we,I[0].width,I[0].height);for(let ie=0,N=I.length;ie<N;ie++)pe=I[ie],T.format!==hn?je!==null?ae?t.compressedTexSubImage2D(s.TEXTURE_2D,ie,0,0,pe.width,pe.height,je,pe.data):t.compressedTexImage2D(s.TEXTURE_2D,ie,we,pe.width,pe.height,0,pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ae?t.texSubImage2D(s.TEXTURE_2D,ie,0,0,pe.width,pe.height,je,Be,pe.data):t.texImage2D(s.TEXTURE_2D,ie,we,pe.width,pe.height,0,je,Be,pe.data)}else if(T.isDataArrayTexture)ae?(Se&&t.texStorage3D(s.TEXTURE_2D_ARRAY,_e,we,ee.width,ee.height,ee.depth),t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,je,Be,ee.data)):t.texImage3D(s.TEXTURE_2D_ARRAY,0,we,ee.width,ee.height,ee.depth,0,je,Be,ee.data);else if(T.isData3DTexture)ae?(Se&&t.texStorage3D(s.TEXTURE_3D,_e,we,ee.width,ee.height,ee.depth),t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,je,Be,ee.data)):t.texImage3D(s.TEXTURE_3D,0,we,ee.width,ee.height,ee.depth,0,je,Be,ee.data);else if(T.isFramebufferTexture){if(Se)if(ae)t.texStorage2D(s.TEXTURE_2D,_e,we,ee.width,ee.height);else{let ie=ee.width,N=ee.height;for(let le=0;le<_e;le++)t.texImage2D(s.TEXTURE_2D,le,we,ie,N,0,je,Be,null),ie>>=1,N>>=1}}else if(I.length>0&&rt){ae&&Se&&t.texStorage2D(s.TEXTURE_2D,_e,we,I[0].width,I[0].height);for(let ie=0,N=I.length;ie<N;ie++)pe=I[ie],ae?t.texSubImage2D(s.TEXTURE_2D,ie,0,0,je,Be,pe):t.texImage2D(s.TEXTURE_2D,ie,we,je,Be,pe);T.generateMipmaps=!1}else ae?(Se&&t.texStorage2D(s.TEXTURE_2D,_e,we,ee.width,ee.height),t.texSubImage2D(s.TEXTURE_2D,0,0,0,je,Be,ee)):t.texImage2D(s.TEXTURE_2D,0,we,je,Be,ee);x(T,rt)&&v(re),ye.__version=oe.version,T.onUpdate&&T.onUpdate(T)}R.__version=T.version}function ve(R,T,k){if(T.image.length!==6)return;const re=Q(R,T),ne=T.source;t.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+k);const oe=n.get(ne);if(ne.version!==oe.__version||re===!0){t.activeTexture(s.TEXTURE0+k);const ye=lt.getPrimaries(lt.workingColorSpace),fe=T.colorSpace===un?null:lt.getPrimaries(T.colorSpace),xe=T.colorSpace===un||ye===fe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const De=T.isCompressedTexture||T.image[0].isCompressedTexture,We=T.image[0]&&T.image[0].isDataTexture,ee=[];for(let ie=0;ie<6;ie++)!De&&!We?ee[ie]=_(T.image[ie],!1,!0,i.maxCubemapSize):ee[ie]=We?T.image[ie].image:T.image[ie],ee[ie]=ke(T,ee[ie]);const rt=ee[0],je=m(rt)||a,Be=r.convert(T.format,T.colorSpace),we=r.convert(T.type),pe=M(T.internalFormat,Be,we,T.colorSpace),I=a&&T.isVideoTexture!==!0,ae=oe.__version===void 0||re===!0;let Se=y(T,rt,je);V(s.TEXTURE_CUBE_MAP,T,je);let _e;if(De){I&&ae&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Se,pe,rt.width,rt.height);for(let ie=0;ie<6;ie++){_e=ee[ie].mipmaps;for(let N=0;N<_e.length;N++){const le=_e[N];T.format!==hn?Be!==null?I?t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,N,0,0,le.width,le.height,Be,le.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,N,pe,le.width,le.height,0,le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,N,0,0,le.width,le.height,Be,we,le.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,N,pe,le.width,le.height,0,Be,we,le.data)}}}else{_e=T.mipmaps,I&&ae&&(_e.length>0&&Se++,t.texStorage2D(s.TEXTURE_CUBE_MAP,Se,pe,ee[0].width,ee[0].height));for(let ie=0;ie<6;ie++)if(We){I?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,ee[ie].width,ee[ie].height,Be,we,ee[ie].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,pe,ee[ie].width,ee[ie].height,0,Be,we,ee[ie].data);for(let N=0;N<_e.length;N++){const de=_e[N].image[ie].image;I?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,N+1,0,0,de.width,de.height,Be,we,de.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,N+1,pe,de.width,de.height,0,Be,we,de.data)}}else{I?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Be,we,ee[ie]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,pe,Be,we,ee[ie]);for(let N=0;N<_e.length;N++){const le=_e[N];I?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,N+1,0,0,Be,we,le.image[ie]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,N+1,pe,Be,we,le.image[ie])}}}x(T,je)&&v(s.TEXTURE_CUBE_MAP),oe.__version=ne.version,T.onUpdate&&T.onUpdate(T)}R.__version=T.version}function ge(R,T,k,re,ne,oe){const ye=r.convert(k.format,k.colorSpace),fe=r.convert(k.type),xe=M(k.internalFormat,ye,fe,k.colorSpace);if(!n.get(T).__hasExternalTextures){const We=Math.max(1,T.width>>oe),ee=Math.max(1,T.height>>oe);ne===s.TEXTURE_3D||ne===s.TEXTURE_2D_ARRAY?t.texImage3D(ne,oe,xe,We,ee,T.depth,0,ye,fe,null):t.texImage2D(ne,oe,xe,We,ee,0,ye,fe,null)}t.bindFramebuffer(s.FRAMEBUFFER,R),Me(T)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,re,ne,n.get(k).__webglTexture,0,Ue(T)):(ne===s.TEXTURE_2D||ne>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,re,ne,n.get(k).__webglTexture,oe),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ae(R,T,k){if(s.bindRenderbuffer(s.RENDERBUFFER,R),T.depthBuffer&&!T.stencilBuffer){let re=a===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(k||Me(T)){const ne=T.depthTexture;ne&&ne.isDepthTexture&&(ne.type===Nn?re=s.DEPTH_COMPONENT32F:ne.type===Zn&&(re=s.DEPTH_COMPONENT24));const oe=Ue(T);Me(T)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,oe,re,T.width,T.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,oe,re,T.width,T.height)}else s.renderbufferStorage(s.RENDERBUFFER,re,T.width,T.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,R)}else if(T.depthBuffer&&T.stencilBuffer){const re=Ue(T);k&&Me(T)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,re,s.DEPTH24_STENCIL8,T.width,T.height):Me(T)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,re,s.DEPTH24_STENCIL8,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,R)}else{const re=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let ne=0;ne<re.length;ne++){const oe=re[ne],ye=r.convert(oe.format,oe.colorSpace),fe=r.convert(oe.type),xe=M(oe.internalFormat,ye,fe,oe.colorSpace),De=Ue(T);k&&Me(T)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,De,xe,T.width,T.height):Me(T)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,De,xe,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,xe,T.width,T.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Fe(R,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,R),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(T.depthTexture).__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),H(T.depthTexture,0);const re=n.get(T.depthTexture).__webglTexture,ne=Ue(T);if(T.depthTexture.format===xi)Me(T)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,re,0,ne):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,re,0);else if(T.depthTexture.format===fs)Me(T)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,re,0,ne):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,re,0);else throw new Error("Unknown depthTexture format")}function Pe(R){const T=n.get(R),k=R.isWebGLCubeRenderTarget===!0;if(R.depthTexture&&!T.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");Fe(T.__webglFramebuffer,R)}else if(k){T.__webglDepthbuffer=[];for(let re=0;re<6;re++)t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer[re]),T.__webglDepthbuffer[re]=s.createRenderbuffer(),Ae(T.__webglDepthbuffer[re],R,!1)}else t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer=s.createRenderbuffer(),Ae(T.__webglDepthbuffer,R,!1);t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ye(R,T,k){const re=n.get(R);T!==void 0&&ge(re.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),k!==void 0&&Pe(R)}function G(R){const T=R.texture,k=n.get(R),re=n.get(T);R.addEventListener("dispose",U),R.isWebGLMultipleRenderTargets!==!0&&(re.__webglTexture===void 0&&(re.__webglTexture=s.createTexture()),re.__version=T.version,o.memory.textures++);const ne=R.isWebGLCubeRenderTarget===!0,oe=R.isWebGLMultipleRenderTargets===!0,ye=m(R)||a;if(ne){k.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(a&&T.mipmaps&&T.mipmaps.length>0){k.__webglFramebuffer[fe]=[];for(let xe=0;xe<T.mipmaps.length;xe++)k.__webglFramebuffer[fe][xe]=s.createFramebuffer()}else k.__webglFramebuffer[fe]=s.createFramebuffer()}else{if(a&&T.mipmaps&&T.mipmaps.length>0){k.__webglFramebuffer=[];for(let fe=0;fe<T.mipmaps.length;fe++)k.__webglFramebuffer[fe]=s.createFramebuffer()}else k.__webglFramebuffer=s.createFramebuffer();if(oe)if(i.drawBuffers){const fe=R.texture;for(let xe=0,De=fe.length;xe<De;xe++){const We=n.get(fe[xe]);We.__webglTexture===void 0&&(We.__webglTexture=s.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&R.samples>0&&Me(R)===!1){const fe=oe?T:[T];k.__webglMultisampledFramebuffer=s.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let xe=0;xe<fe.length;xe++){const De=fe[xe];k.__webglColorRenderbuffer[xe]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,k.__webglColorRenderbuffer[xe]);const We=r.convert(De.format,De.colorSpace),ee=r.convert(De.type),rt=M(De.internalFormat,We,ee,De.colorSpace,R.isXRRenderTarget===!0),je=Ue(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,je,rt,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+xe,s.RENDERBUFFER,k.__webglColorRenderbuffer[xe])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(k.__webglDepthRenderbuffer=s.createRenderbuffer(),Ae(k.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ne){t.bindTexture(s.TEXTURE_CUBE_MAP,re.__webglTexture),V(s.TEXTURE_CUBE_MAP,T,ye);for(let fe=0;fe<6;fe++)if(a&&T.mipmaps&&T.mipmaps.length>0)for(let xe=0;xe<T.mipmaps.length;xe++)ge(k.__webglFramebuffer[fe][xe],R,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+fe,xe);else ge(k.__webglFramebuffer[fe],R,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);x(T,ye)&&v(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(oe){const fe=R.texture;for(let xe=0,De=fe.length;xe<De;xe++){const We=fe[xe],ee=n.get(We);t.bindTexture(s.TEXTURE_2D,ee.__webglTexture),V(s.TEXTURE_2D,We,ye),ge(k.__webglFramebuffer,R,We,s.COLOR_ATTACHMENT0+xe,s.TEXTURE_2D,0),x(We,ye)&&v(s.TEXTURE_2D)}t.unbindTexture()}else{let fe=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(a?fe=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(fe,re.__webglTexture),V(fe,T,ye),a&&T.mipmaps&&T.mipmaps.length>0)for(let xe=0;xe<T.mipmaps.length;xe++)ge(k.__webglFramebuffer[xe],R,T,s.COLOR_ATTACHMENT0,fe,xe);else ge(k.__webglFramebuffer,R,T,s.COLOR_ATTACHMENT0,fe,0);x(T,ye)&&v(fe),t.unbindTexture()}R.depthBuffer&&Pe(R)}function Rt(R){const T=m(R)||a,k=R.isWebGLMultipleRenderTargets===!0?R.texture:[R.texture];for(let re=0,ne=k.length;re<ne;re++){const oe=k[re];if(x(oe,T)){const ye=R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,fe=n.get(oe).__webglTexture;t.bindTexture(ye,fe),v(ye),t.unbindTexture()}}}function be(R){if(a&&R.samples>0&&Me(R)===!1){const T=R.isWebGLMultipleRenderTargets?R.texture:[R.texture],k=R.width,re=R.height;let ne=s.COLOR_BUFFER_BIT;const oe=[],ye=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,fe=n.get(R),xe=R.isWebGLMultipleRenderTargets===!0;if(xe)for(let De=0;De<T.length;De++)t.bindFramebuffer(s.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+De,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,fe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+De,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,fe.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,fe.__webglFramebuffer);for(let De=0;De<T.length;De++){oe.push(s.COLOR_ATTACHMENT0+De),R.depthBuffer&&oe.push(ye);const We=fe.__ignoreDepthValues!==void 0?fe.__ignoreDepthValues:!1;if(We===!1&&(R.depthBuffer&&(ne|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&(ne|=s.STENCIL_BUFFER_BIT)),xe&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,fe.__webglColorRenderbuffer[De]),We===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[ye]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[ye])),xe){const ee=n.get(T[De]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ee,0)}s.blitFramebuffer(0,0,k,re,0,0,k,re,ne,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,oe)}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),xe)for(let De=0;De<T.length;De++){t.bindFramebuffer(s.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+De,s.RENDERBUFFER,fe.__webglColorRenderbuffer[De]);const We=n.get(T[De]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,fe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+De,s.TEXTURE_2D,We,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,fe.__webglMultisampledFramebuffer)}}function Ue(R){return Math.min(i.maxSamples,R.samples)}function Me(R){const T=n.get(R);return a&&R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function at(R){const T=o.render.frame;h.get(R)!==T&&(h.set(R,T),R.update())}function ke(R,T){const k=R.colorSpace,re=R.format,ne=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||R.format===aa||k!==zn&&k!==un&&(lt.getTransfer(k)===ft?a===!1?e.has("EXT_sRGB")===!0&&re===hn?(R.format=aa,R.minFilter=ln,R.generateMipmaps=!1):T=Vh.sRGBToLinear(T):(re!==hn||ne!==ii)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),T}this.allocateTextureUnit=D,this.resetTextureUnits=z,this.setTexture2D=H,this.setTexture2DArray=q,this.setTexture3D=K,this.setTextureCube=j,this.rebindTextures=Ye,this.setupRenderTarget=G,this.updateRenderTargetMipmap=Rt,this.updateMultisampleRenderTarget=be,this.setupDepthRenderbuffer=Pe,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=Me}function a_(s,e,t){const n=t.isWebGL2;function i(r,o=un){let a;const l=lt.getTransfer(o);if(r===ii)return s.UNSIGNED_BYTE;if(r===Uh)return s.UNSIGNED_SHORT_4_4_4_4;if(r===Fh)return s.UNSIGNED_SHORT_5_5_5_1;if(r===Pd)return s.BYTE;if(r===Rd)return s.SHORT;if(r===ya)return s.UNSIGNED_SHORT;if(r===Dh)return s.INT;if(r===Zn)return s.UNSIGNED_INT;if(r===Nn)return s.FLOAT;if(r===zs)return n?s.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Cd)return s.ALPHA;if(r===hn)return s.RGBA;if(r===Ld)return s.LUMINANCE;if(r===Id)return s.LUMINANCE_ALPHA;if(r===xi)return s.DEPTH_COMPONENT;if(r===fs)return s.DEPTH_STENCIL;if(r===aa)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Dd)return s.RED;if(r===Nh)return s.RED_INTEGER;if(r===Ud)return s.RG;if(r===Oh)return s.RG_INTEGER;if(r===Bh)return s.RGBA_INTEGER;if(r===lo||r===co||r===ho||r===uo)if(l===ft)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===lo)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===co)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ho)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===uo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===lo)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===co)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ho)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===uo)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===ol||r===al||r===ll||r===cl)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===ol)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===al)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===ll)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===cl)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===zh)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===hl||r===ul)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(r===hl)return l===ft?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===ul)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===dl||r===fl||r===pl||r===ml||r===gl||r===_l||r===vl||r===xl||r===Ml||r===yl||r===Sl||r===El||r===bl||r===wl)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(r===dl)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===fl)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===pl)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===ml)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===gl)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===_l)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===vl)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===xl)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Ml)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===yl)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Sl)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===El)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===bl)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===wl)return l===ft?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===fo||r===Tl||r===Al)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(r===fo)return l===ft?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Tl)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Al)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Fd||r===Pl||r===Rl||r===Cl)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(r===fo)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Pl)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Rl)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Cl)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===vi?n?s.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}class l_ extends qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class wn extends dt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const c_={type:"move"};class Oo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new wn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new wn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new wn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(c_)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new wn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class h_ extends Ci{constructor(e,t){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,g=null;const _=t.getContextAttributes();let m=null,f=null;const x=[],v=[],M=new Le;let y=null;const b=new qt;b.layers.enable(1),b.viewport=new ot;const w=new qt;w.layers.enable(2),w.viewport=new ot;const U=[b,w],S=new l_;S.layers.enable(1),S.layers.enable(2);let E=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let Q=x[V];return Q===void 0&&(Q=new Oo,x[V]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(V){let Q=x[V];return Q===void 0&&(Q=new Oo,x[V]=Q),Q.getGripSpace()},this.getHand=function(V){let Q=x[V];return Q===void 0&&(Q=new Oo,x[V]=Q),Q.getHandSpace()};function F(V){const Q=v.indexOf(V.inputSource);if(Q===-1)return;const he=x[Q];he!==void 0&&(he.update(V.inputSource,V.frame,c||o),he.dispatchEvent({type:V.type,data:V.inputSource}))}function z(){i.removeEventListener("select",F),i.removeEventListener("selectstart",F),i.removeEventListener("selectend",F),i.removeEventListener("squeeze",F),i.removeEventListener("squeezestart",F),i.removeEventListener("squeezeend",F),i.removeEventListener("end",z),i.removeEventListener("inputsourceschange",D);for(let V=0;V<x.length;V++){const Q=v[V];Q!==null&&(v[V]=null,x[V].disconnect(Q))}E=null,L=null,e.setRenderTarget(m),p=null,d=null,u=null,i=null,f=null,se.stop(),n.isPresenting=!1,e.setPixelRatio(y),e.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){a=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(V){c=V},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(V){if(i=V,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",F),i.addEventListener("selectstart",F),i.addEventListener("selectend",F),i.addEventListener("squeeze",F),i.addEventListener("squeezestart",F),i.addEventListener("squeezeend",F),i.addEventListener("end",z),i.addEventListener("inputsourceschange",D),_.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(M),i.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Q={antialias:i.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(i,t,Q),i.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),f=new bi(p.framebufferWidth,p.framebufferHeight,{format:hn,type:ii,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil})}else{let Q=null,he=null,ve=null;_.depth&&(ve=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Q=_.stencil?fs:xi,he=_.stencil?vi:Zn);const ge={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:r};u=new XRWebGLBinding(i,t),d=u.createProjectionLayer(ge),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),f=new bi(d.textureWidth,d.textureHeight,{format:hn,type:ii,depthTexture:new Qh(d.textureWidth,d.textureHeight,he,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0});const Ae=e.properties.get(f);Ae.__ignoreDepthValues=d.ignoreDepthValues}f.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),se.setContext(i),se.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function D(V){for(let Q=0;Q<V.removed.length;Q++){const he=V.removed[Q],ve=v.indexOf(he);ve>=0&&(v[ve]=null,x[ve].disconnect(he))}for(let Q=0;Q<V.added.length;Q++){const he=V.added[Q];let ve=v.indexOf(he);if(ve===-1){for(let Ae=0;Ae<x.length;Ae++)if(Ae>=v.length){v.push(he),ve=Ae;break}else if(v[Ae]===null){v[Ae]=he,ve=Ae;break}if(ve===-1)break}const ge=x[ve];ge&&ge.connect(he)}}const O=new C,H=new C;function q(V,Q,he){O.setFromMatrixPosition(Q.matrixWorld),H.setFromMatrixPosition(he.matrixWorld);const ve=O.distanceTo(H),ge=Q.projectionMatrix.elements,Ae=he.projectionMatrix.elements,Fe=ge[14]/(ge[10]-1),Pe=ge[14]/(ge[10]+1),Ye=(ge[9]+1)/ge[5],G=(ge[9]-1)/ge[5],Rt=(ge[8]-1)/ge[0],be=(Ae[8]+1)/Ae[0],Ue=Fe*Rt,Me=Fe*be,at=ve/(-Rt+be),ke=at*-Rt;Q.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(ke),V.translateZ(at),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert();const R=Fe+at,T=Pe+at,k=Ue-ke,re=Me+(ve-ke),ne=Ye*Pe/T*R,oe=G*Pe/T*R;V.projectionMatrix.makePerspective(k,re,ne,oe,R,T),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}function K(V,Q){Q===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(Q.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(i===null)return;S.near=w.near=b.near=V.near,S.far=w.far=b.far=V.far,(E!==S.near||L!==S.far)&&(i.updateRenderState({depthNear:S.near,depthFar:S.far}),E=S.near,L=S.far);const Q=V.parent,he=S.cameras;K(S,Q);for(let ve=0;ve<he.length;ve++)K(he[ve],Q);he.length===2?q(S,b,w):S.projectionMatrix.copy(b.projectionMatrix),j(V,S,Q)};function j(V,Q,he){he===null?V.matrix.copy(Q.matrixWorld):(V.matrix.copy(he.matrixWorld),V.matrix.invert(),V.matrix.multiply(Q.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(Q.projectionMatrix),V.projectionMatrixInverse.copy(Q.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=ps*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(V){l=V,d!==null&&(d.fixedFoveation=V),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=V)};let $=null;function te(V,Q){if(h=Q.getViewerPose(c||o),g=Q,h!==null){const he=h.views;p!==null&&(e.setRenderTargetFramebuffer(f,p.framebuffer),e.setRenderTarget(f));let ve=!1;he.length!==S.cameras.length&&(S.cameras.length=0,ve=!0);for(let ge=0;ge<he.length;ge++){const Ae=he[ge];let Fe=null;if(p!==null)Fe=p.getViewport(Ae);else{const Ye=u.getViewSubImage(d,Ae);Fe=Ye.viewport,ge===0&&(e.setRenderTargetTextures(f,Ye.colorTexture,d.ignoreDepthValues?void 0:Ye.depthStencilTexture),e.setRenderTarget(f))}let Pe=U[ge];Pe===void 0&&(Pe=new qt,Pe.layers.enable(ge),Pe.viewport=new ot,U[ge]=Pe),Pe.matrix.fromArray(Ae.transform.matrix),Pe.matrix.decompose(Pe.position,Pe.quaternion,Pe.scale),Pe.projectionMatrix.fromArray(Ae.projectionMatrix),Pe.projectionMatrixInverse.copy(Pe.projectionMatrix).invert(),Pe.viewport.set(Fe.x,Fe.y,Fe.width,Fe.height),ge===0&&(S.matrix.copy(Pe.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),ve===!0&&S.cameras.push(Pe)}}for(let he=0;he<x.length;he++){const ve=v[he],ge=x[he];ve!==null&&ge!==void 0&&ge.update(ve,Q,c||o)}$&&$(V,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),g=null}const se=new $h;se.setAnimationLoop(te),this.setAnimationLoop=function(V){$=V},this.dispose=function(){}}}function u_(s,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,jh(s)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function i(m,f,x,v,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,M)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,x,v):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Zt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Zt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const x=e.get(f).envMap;if(x&&(m.envMap.value=x,m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap){m.lightMap.value=f.lightMap;const v=s._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=f.lightMapIntensity*v,t(f.lightMap,m.lightMapTransform)}f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,x,v){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*x,m.scale.value=v*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),e.get(f).envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,x){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Zt&&m.clearcoatNormalScale.value.negate())),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){const x=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function d_(s,e,t,n){let i={},r={},o=[];const a=t.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(x,v){const M=v.program;n.uniformBlockBinding(x,M)}function c(x,v){let M=i[x.id];M===void 0&&(g(x),M=h(x),i[x.id]=M,x.addEventListener("dispose",m));const y=v.program;n.updateUBOMapping(x,y);const b=e.render.frame;r[x.id]!==b&&(d(x),r[x.id]=b)}function h(x){const v=u();x.__bindingPointIndex=v;const M=s.createBuffer(),y=x.__size,b=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,y,b),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,v,M),M}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const v=i[x.id],M=x.uniforms,y=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,v);for(let b=0,w=M.length;b<w;b++){const U=Array.isArray(M[b])?M[b]:[M[b]];for(let S=0,E=U.length;S<E;S++){const L=U[S];if(p(L,b,S,y)===!0){const F=L.__offset,z=Array.isArray(L.value)?L.value:[L.value];let D=0;for(let O=0;O<z.length;O++){const H=z[O],q=_(H);typeof H=="number"||typeof H=="boolean"?(L.__data[0]=H,s.bufferSubData(s.UNIFORM_BUFFER,F+D,L.__data)):H.isMatrix3?(L.__data[0]=H.elements[0],L.__data[1]=H.elements[1],L.__data[2]=H.elements[2],L.__data[3]=0,L.__data[4]=H.elements[3],L.__data[5]=H.elements[4],L.__data[6]=H.elements[5],L.__data[7]=0,L.__data[8]=H.elements[6],L.__data[9]=H.elements[7],L.__data[10]=H.elements[8],L.__data[11]=0):(H.toArray(L.__data,D),D+=q.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,F,L.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function p(x,v,M,y){const b=x.value,w=v+"_"+M;if(y[w]===void 0)return typeof b=="number"||typeof b=="boolean"?y[w]=b:y[w]=b.clone(),!0;{const U=y[w];if(typeof b=="number"||typeof b=="boolean"){if(U!==b)return y[w]=b,!0}else if(U.equals(b)===!1)return U.copy(b),!0}return!1}function g(x){const v=x.uniforms;let M=0;const y=16;for(let w=0,U=v.length;w<U;w++){const S=Array.isArray(v[w])?v[w]:[v[w]];for(let E=0,L=S.length;E<L;E++){const F=S[E],z=Array.isArray(F.value)?F.value:[F.value];for(let D=0,O=z.length;D<O;D++){const H=z[D],q=_(H),K=M%y;K!==0&&y-K<q.boundary&&(M+=y-K),F.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=M,M+=q.storage}}}const b=M%y;return b>0&&(M+=y-b),x.__size=M,x.__cache={},this}function _(x){const v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function m(x){const v=x.target;v.removeEventListener("dispose",m);const M=o.indexOf(v.__bindingPointIndex);o.splice(M,1),s.deleteBuffer(i[v.id]),delete i[v.id],delete r[v.id]}function f(){for(const x in i)s.deleteBuffer(i[x]);o=[],i={},r={}}return{bind:l,update:c,dispose:f}}class su{constructor(e={}){const{canvas:t=lf(),context:n=null,depth:i=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;const p=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const f=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Tt,this._useLegacyLights=!1,this.toneMapping=ni,this.toneMappingExposure=1;const v=this;let M=!1,y=0,b=0,w=null,U=-1,S=null;const E=new ot,L=new ot;let F=null;const z=new He(0);let D=0,O=t.width,H=t.height,q=1,K=null,j=null;const $=new ot(0,0,O,H),te=new ot(0,0,O,H);let se=!1;const V=new Aa;let Q=!1,he=!1,ve=null;const ge=new Te,Ae=new Le,Fe=new C,Pe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Ye(){return w===null?q:1}let G=n;function Rt(A,B){for(let X=0;X<A.length;X++){const Y=A[X],W=t.getContext(Y,B);if(W!==null)return W}return null}try{const A={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ma}`),t.addEventListener("webglcontextlost",ie,!1),t.addEventListener("webglcontextrestored",N,!1),t.addEventListener("webglcontextcreationerror",le,!1),G===null){const B=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&B.shift(),G=Rt(B,A),G===null)throw Rt(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&G instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),G.getShaderPrecisionFormat===void 0&&(G.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let be,Ue,Me,at,ke,R,T,k,re,ne,oe,ye,fe,xe,De,We,ee,rt,je,Be,we,pe,I,ae;function Se(){be=new Sg(G),Ue=new gg(G,be,e),be.init(Ue),pe=new a_(G,be,Ue),Me=new r_(G,be,Ue),at=new wg(G),ke=new X0,R=new o_(G,be,Me,ke,Ue,pe,at),T=new vg(v),k=new yg(v),re=new Df(G,Ue),I=new pg(G,be,re,Ue),ne=new Eg(G,re,at,I),oe=new Rg(G,ne,re,at),je=new Pg(G,Ue,R),We=new _g(ke),ye=new W0(v,T,k,be,Ue,I,We),fe=new u_(v,ke),xe=new q0,De=new J0(be,Ue),rt=new fg(v,T,k,Me,oe,d,l),ee=new s_(v,oe,Ue),ae=new d_(G,at,Ue,Me),Be=new mg(G,be,at,Ue),we=new bg(G,be,at,Ue),at.programs=ye.programs,v.capabilities=Ue,v.extensions=be,v.properties=ke,v.renderLists=xe,v.shadowMap=ee,v.state=Me,v.info=at}Se();const _e=new h_(v,G);this.xr=_e,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const A=be.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=be.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(A){A!==void 0&&(q=A,this.setSize(O,H,!1))},this.getSize=function(A){return A.set(O,H)},this.setSize=function(A,B,X=!0){if(_e.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=A,H=B,t.width=Math.floor(A*q),t.height=Math.floor(B*q),X===!0&&(t.style.width=A+"px",t.style.height=B+"px"),this.setViewport(0,0,A,B)},this.getDrawingBufferSize=function(A){return A.set(O*q,H*q).floor()},this.setDrawingBufferSize=function(A,B,X){O=A,H=B,q=X,t.width=Math.floor(A*X),t.height=Math.floor(B*X),this.setViewport(0,0,A,B)},this.getCurrentViewport=function(A){return A.copy(E)},this.getViewport=function(A){return A.copy($)},this.setViewport=function(A,B,X,Y){A.isVector4?$.set(A.x,A.y,A.z,A.w):$.set(A,B,X,Y),Me.viewport(E.copy($).multiplyScalar(q).floor())},this.getScissor=function(A){return A.copy(te)},this.setScissor=function(A,B,X,Y){A.isVector4?te.set(A.x,A.y,A.z,A.w):te.set(A,B,X,Y),Me.scissor(L.copy(te).multiplyScalar(q).floor())},this.getScissorTest=function(){return se},this.setScissorTest=function(A){Me.setScissorTest(se=A)},this.setOpaqueSort=function(A){K=A},this.setTransparentSort=function(A){j=A},this.getClearColor=function(A){return A.copy(rt.getClearColor())},this.setClearColor=function(){rt.setClearColor.apply(rt,arguments)},this.getClearAlpha=function(){return rt.getClearAlpha()},this.setClearAlpha=function(){rt.setClearAlpha.apply(rt,arguments)},this.clear=function(A=!0,B=!0,X=!0){let Y=0;if(A){let W=!1;if(w!==null){const me=w.texture.format;W=me===Bh||me===Oh||me===Nh}if(W){const me=w.texture.type,Ee=me===ii||me===Zn||me===ya||me===vi||me===Uh||me===Fh,Oe=rt.getClearColor(),ze=rt.getClearAlpha(),Ze=Oe.r,Ge=Oe.g,Xe=Oe.b;Ee?(p[0]=Ze,p[1]=Ge,p[2]=Xe,p[3]=ze,G.clearBufferuiv(G.COLOR,0,p)):(g[0]=Ze,g[1]=Ge,g[2]=Xe,g[3]=ze,G.clearBufferiv(G.COLOR,0,g))}else Y|=G.COLOR_BUFFER_BIT}B&&(Y|=G.DEPTH_BUFFER_BIT),X&&(Y|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ie,!1),t.removeEventListener("webglcontextrestored",N,!1),t.removeEventListener("webglcontextcreationerror",le,!1),xe.dispose(),De.dispose(),ke.dispose(),T.dispose(),k.dispose(),oe.dispose(),I.dispose(),ae.dispose(),ye.dispose(),_e.dispose(),_e.removeEventListener("sessionstart",St),_e.removeEventListener("sessionend",it),ve&&(ve.dispose(),ve=null),At.stop()};function ie(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function N(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const A=at.autoReset,B=ee.enabled,X=ee.autoUpdate,Y=ee.needsUpdate,W=ee.type;Se(),at.autoReset=A,ee.enabled=B,ee.autoUpdate=X,ee.needsUpdate=Y,ee.type=W}function le(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function de(A){const B=A.target;B.removeEventListener("dispose",de),Ne(B)}function Ne(A){Ie(A),ke.remove(A)}function Ie(A){const B=ke.get(A).programs;B!==void 0&&(B.forEach(function(X){ye.releaseProgram(X)}),A.isShaderMaterial&&ye.releaseShaderCache(A))}this.renderBufferDirect=function(A,B,X,Y,W,me){B===null&&(B=Pe);const Ee=W.isMesh&&W.matrixWorld.determinant()<0,Oe=Ou(A,B,X,Y,W);Me.setMaterial(Y,Ee);let ze=X.index,Ze=1;if(Y.wireframe===!0){if(ze=ne.getWireframeAttribute(X),ze===void 0)return;Ze=2}const Ge=X.drawRange,Xe=X.attributes.position;let Et=Ge.start*Ze,Kt=(Ge.start+Ge.count)*Ze;me!==null&&(Et=Math.max(Et,me.start*Ze),Kt=Math.min(Kt,(me.start+me.count)*Ze)),ze!==null?(Et=Math.max(Et,0),Kt=Math.min(Kt,ze.count)):Xe!=null&&(Et=Math.max(Et,0),Kt=Math.min(Kt,Xe.count));const It=Kt-Et;if(It<0||It===1/0)return;I.setup(W,Y,Oe,X,ze);let An,_t=Be;if(ze!==null&&(An=re.get(ze),_t=we,_t.setIndex(An)),W.isMesh)Y.wireframe===!0?(Me.setLineWidth(Y.wireframeLinewidth*Ye()),_t.setMode(G.LINES)):_t.setMode(G.TRIANGLES);else if(W.isLine){let Je=Y.linewidth;Je===void 0&&(Je=1),Me.setLineWidth(Je*Ye()),W.isLineSegments?_t.setMode(G.LINES):W.isLineLoop?_t.setMode(G.LINE_LOOP):_t.setMode(G.LINE_STRIP)}else W.isPoints?_t.setMode(G.POINTS):W.isSprite&&_t.setMode(G.TRIANGLES);if(W.isBatchedMesh)_t.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else if(W.isInstancedMesh)_t.renderInstances(Et,It,W.count);else if(X.isInstancedBufferGeometry){const Je=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,io=Math.min(X.instanceCount,Je);_t.renderInstances(Et,It,io)}else _t.render(Et,It)};function et(A,B,X){A.transparent===!0&&A.side===en&&A.forceSinglePass===!1?(A.side=Zt,A.needsUpdate=!0,Qs(A,B,X),A.side=si,A.needsUpdate=!0,Qs(A,B,X),A.side=en):Qs(A,B,X)}this.compile=function(A,B,X=null){X===null&&(X=A),m=De.get(X),m.init(),x.push(m),X.traverseVisible(function(W){W.isLight&&W.layers.test(B.layers)&&(m.pushLight(W),W.castShadow&&m.pushShadow(W))}),A!==X&&A.traverseVisible(function(W){W.isLight&&W.layers.test(B.layers)&&(m.pushLight(W),W.castShadow&&m.pushShadow(W))}),m.setupLights(v._useLegacyLights);const Y=new Set;return A.traverse(function(W){const me=W.material;if(me)if(Array.isArray(me))for(let Ee=0;Ee<me.length;Ee++){const Oe=me[Ee];et(Oe,X,W),Y.add(Oe)}else et(me,X,W),Y.add(me)}),x.pop(),m=null,Y},this.compileAsync=function(A,B,X=null){const Y=this.compile(A,B,X);return new Promise(W=>{function me(){if(Y.forEach(function(Ee){ke.get(Ee).currentProgram.isReady()&&Y.delete(Ee)}),Y.size===0){W(A);return}setTimeout(me,10)}be.get("KHR_parallel_shader_compile")!==null?me():setTimeout(me,10)})};let tt=null;function xt(A){tt&&tt(A)}function St(){At.stop()}function it(){At.start()}const At=new $h;At.setAnimationLoop(xt),typeof self<"u"&&At.setContext(self),this.setAnimationLoop=function(A){tt=A,_e.setAnimationLoop(A),A===null?At.stop():At.start()},_e.addEventListener("sessionstart",St),_e.addEventListener("sessionend",it),this.render=function(A,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),_e.enabled===!0&&_e.isPresenting===!0&&(_e.cameraAutoUpdate===!0&&_e.updateCamera(B),B=_e.getCamera()),A.isScene===!0&&A.onBeforeRender(v,A,B,w),m=De.get(A,x.length),m.init(),x.push(m),ge.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),V.setFromProjectionMatrix(ge),he=this.localClippingEnabled,Q=We.init(this.clippingPlanes,he),_=xe.get(A,f.length),_.init(),f.push(_),Sn(A,B,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(K,j),this.info.render.frame++,Q===!0&&We.beginShadows();const X=m.state.shadowsArray;if(ee.render(X,A,B),Q===!0&&We.endShadows(),this.info.autoReset===!0&&this.info.reset(),rt.render(_,A),m.setupLights(v._useLegacyLights),B.isArrayCamera){const Y=B.cameras;for(let W=0,me=Y.length;W<me;W++){const Ee=Y[W];Wa(_,A,Ee,Ee.viewport)}}else Wa(_,A,B);w!==null&&(R.updateMultisampleRenderTarget(w),R.updateRenderTargetMipmap(w)),A.isScene===!0&&A.onAfterRender(v,A,B),I.resetDefaultState(),U=-1,S=null,x.pop(),x.length>0?m=x[x.length-1]:m=null,f.pop(),f.length>0?_=f[f.length-1]:_=null};function Sn(A,B,X,Y){if(A.visible===!1)return;if(A.layers.test(B.layers)){if(A.isGroup)X=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(B);else if(A.isLight)m.pushLight(A),A.castShadow&&m.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||V.intersectsSprite(A)){Y&&Fe.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ge);const Ee=oe.update(A),Oe=A.material;Oe.visible&&_.push(A,Ee,Oe,X,Fe.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||V.intersectsObject(A))){const Ee=oe.update(A),Oe=A.material;if(Y&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Fe.copy(A.boundingSphere.center)):(Ee.boundingSphere===null&&Ee.computeBoundingSphere(),Fe.copy(Ee.boundingSphere.center)),Fe.applyMatrix4(A.matrixWorld).applyMatrix4(ge)),Array.isArray(Oe)){const ze=Ee.groups;for(let Ze=0,Ge=ze.length;Ze<Ge;Ze++){const Xe=ze[Ze],Et=Oe[Xe.materialIndex];Et&&Et.visible&&_.push(A,Ee,Et,X,Fe.z,Xe)}}else Oe.visible&&_.push(A,Ee,Oe,X,Fe.z,null)}}const me=A.children;for(let Ee=0,Oe=me.length;Ee<Oe;Ee++)Sn(me[Ee],B,X,Y)}function Wa(A,B,X,Y){const W=A.opaque,me=A.transmissive,Ee=A.transparent;m.setupLightsView(X),Q===!0&&We.setGlobalState(v.clippingPlanes,X),me.length>0&&Nu(W,me,B,X),Y&&Me.viewport(E.copy(Y)),W.length>0&&$s(W,B,X),me.length>0&&$s(me,B,X),Ee.length>0&&$s(Ee,B,X),Me.buffers.depth.setTest(!0),Me.buffers.depth.setMask(!0),Me.buffers.color.setMask(!0),Me.setPolygonOffset(!1)}function Nu(A,B,X,Y){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;const me=Ue.isWebGL2;ve===null&&(ve=new bi(1,1,{generateMipmaps:!0,type:be.has("EXT_color_buffer_half_float")?zs:ii,minFilter:Bs,samples:me?4:0})),v.getDrawingBufferSize(Ae),me?ve.setSize(Ae.x,Ae.y):ve.setSize(Yr(Ae.x),Yr(Ae.y));const Ee=v.getRenderTarget();v.setRenderTarget(ve),v.getClearColor(z),D=v.getClearAlpha(),D<1&&v.setClearColor(16777215,.5),v.clear();const Oe=v.toneMapping;v.toneMapping=ni,$s(A,X,Y),R.updateMultisampleRenderTarget(ve),R.updateRenderTargetMipmap(ve);let ze=!1;for(let Ze=0,Ge=B.length;Ze<Ge;Ze++){const Xe=B[Ze],Et=Xe.object,Kt=Xe.geometry,It=Xe.material,An=Xe.group;if(It.side===en&&Et.layers.test(Y.layers)){const _t=It.side;It.side=Zt,It.needsUpdate=!0,Xa(Et,X,Y,Kt,It,An),It.side=_t,It.needsUpdate=!0,ze=!0}}ze===!0&&(R.updateMultisampleRenderTarget(ve),R.updateRenderTargetMipmap(ve)),v.setRenderTarget(Ee),v.setClearColor(z,D),v.toneMapping=Oe}function $s(A,B,X){const Y=B.isScene===!0?B.overrideMaterial:null;for(let W=0,me=A.length;W<me;W++){const Ee=A[W],Oe=Ee.object,ze=Ee.geometry,Ze=Y===null?Ee.material:Y,Ge=Ee.group;Oe.layers.test(X.layers)&&Xa(Oe,B,X,ze,Ze,Ge)}}function Xa(A,B,X,Y,W,me){A.onBeforeRender(v,B,X,Y,W,me),A.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),W.onBeforeRender(v,B,X,Y,A,me),W.transparent===!0&&W.side===en&&W.forceSinglePass===!1?(W.side=Zt,W.needsUpdate=!0,v.renderBufferDirect(X,B,Y,W,A,me),W.side=si,W.needsUpdate=!0,v.renderBufferDirect(X,B,Y,W,A,me),W.side=en):v.renderBufferDirect(X,B,Y,W,A,me),A.onAfterRender(v,B,X,Y,W,me)}function Qs(A,B,X){B.isScene!==!0&&(B=Pe);const Y=ke.get(A),W=m.state.lights,me=m.state.shadowsArray,Ee=W.state.version,Oe=ye.getParameters(A,W.state,me,B,X),ze=ye.getProgramCacheKey(Oe);let Ze=Y.programs;Y.environment=A.isMeshStandardMaterial?B.environment:null,Y.fog=B.fog,Y.envMap=(A.isMeshStandardMaterial?k:T).get(A.envMap||Y.environment),Ze===void 0&&(A.addEventListener("dispose",de),Ze=new Map,Y.programs=Ze);let Ge=Ze.get(ze);if(Ge!==void 0){if(Y.currentProgram===Ge&&Y.lightsStateVersion===Ee)return qa(A,Oe),Ge}else Oe.uniforms=ye.getUniforms(A),A.onBuild(X,Oe,v),A.onBeforeCompile(Oe,v),Ge=ye.acquireProgram(Oe,ze),Ze.set(ze,Ge),Y.uniforms=Oe.uniforms;const Xe=Y.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Xe.clippingPlanes=We.uniform),qa(A,Oe),Y.needsLights=zu(A),Y.lightsStateVersion=Ee,Y.needsLights&&(Xe.ambientLightColor.value=W.state.ambient,Xe.lightProbe.value=W.state.probe,Xe.directionalLights.value=W.state.directional,Xe.directionalLightShadows.value=W.state.directionalShadow,Xe.spotLights.value=W.state.spot,Xe.spotLightShadows.value=W.state.spotShadow,Xe.rectAreaLights.value=W.state.rectArea,Xe.ltc_1.value=W.state.rectAreaLTC1,Xe.ltc_2.value=W.state.rectAreaLTC2,Xe.pointLights.value=W.state.point,Xe.pointLightShadows.value=W.state.pointShadow,Xe.hemisphereLights.value=W.state.hemi,Xe.directionalShadowMap.value=W.state.directionalShadowMap,Xe.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Xe.spotShadowMap.value=W.state.spotShadowMap,Xe.spotLightMatrix.value=W.state.spotLightMatrix,Xe.spotLightMap.value=W.state.spotLightMap,Xe.pointShadowMap.value=W.state.pointShadowMap,Xe.pointShadowMatrix.value=W.state.pointShadowMatrix),Y.currentProgram=Ge,Y.uniformsList=null,Ge}function Ya(A){if(A.uniformsList===null){const B=A.currentProgram.getUniforms();A.uniformsList=Nr.seqWithValue(B.seq,A.uniforms)}return A.uniformsList}function qa(A,B){const X=ke.get(A);X.outputColorSpace=B.outputColorSpace,X.batching=B.batching,X.instancing=B.instancing,X.instancingColor=B.instancingColor,X.skinning=B.skinning,X.morphTargets=B.morphTargets,X.morphNormals=B.morphNormals,X.morphColors=B.morphColors,X.morphTargetsCount=B.morphTargetsCount,X.numClippingPlanes=B.numClippingPlanes,X.numIntersection=B.numClipIntersection,X.vertexAlphas=B.vertexAlphas,X.vertexTangents=B.vertexTangents,X.toneMapping=B.toneMapping}function Ou(A,B,X,Y,W){B.isScene!==!0&&(B=Pe),R.resetTextureUnits();const me=B.fog,Ee=Y.isMeshStandardMaterial?B.environment:null,Oe=w===null?v.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:zn,ze=(Y.isMeshStandardMaterial?k:T).get(Y.envMap||Ee),Ze=Y.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ge=!!X.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Xe=!!X.morphAttributes.position,Et=!!X.morphAttributes.normal,Kt=!!X.morphAttributes.color;let It=ni;Y.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(It=v.toneMapping);const An=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,_t=An!==void 0?An.length:0,Je=ke.get(Y),io=m.state.lights;if(Q===!0&&(he===!0||A!==S)){const rn=A===S&&Y.id===U;We.setState(Y,A,rn)}let Mt=!1;Y.version===Je.__version?(Je.needsLights&&Je.lightsStateVersion!==io.state.version||Je.outputColorSpace!==Oe||W.isBatchedMesh&&Je.batching===!1||!W.isBatchedMesh&&Je.batching===!0||W.isInstancedMesh&&Je.instancing===!1||!W.isInstancedMesh&&Je.instancing===!0||W.isSkinnedMesh&&Je.skinning===!1||!W.isSkinnedMesh&&Je.skinning===!0||W.isInstancedMesh&&Je.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Je.instancingColor===!1&&W.instanceColor!==null||Je.envMap!==ze||Y.fog===!0&&Je.fog!==me||Je.numClippingPlanes!==void 0&&(Je.numClippingPlanes!==We.numPlanes||Je.numIntersection!==We.numIntersection)||Je.vertexAlphas!==Ze||Je.vertexTangents!==Ge||Je.morphTargets!==Xe||Je.morphNormals!==Et||Je.morphColors!==Kt||Je.toneMapping!==It||Ue.isWebGL2===!0&&Je.morphTargetsCount!==_t)&&(Mt=!0):(Mt=!0,Je.__version=Y.version);let oi=Je.currentProgram;Mt===!0&&(oi=Qs(Y,B,W));let ja=!1,ys=!1,so=!1;const Bt=oi.getUniforms(),ai=Je.uniforms;if(Me.useProgram(oi.program)&&(ja=!0,ys=!0,so=!0),Y.id!==U&&(U=Y.id,ys=!0),ja||S!==A){Bt.setValue(G,"projectionMatrix",A.projectionMatrix),Bt.setValue(G,"viewMatrix",A.matrixWorldInverse);const rn=Bt.map.cameraPosition;rn!==void 0&&rn.setValue(G,Fe.setFromMatrixPosition(A.matrixWorld)),Ue.logarithmicDepthBuffer&&Bt.setValue(G,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&Bt.setValue(G,"isOrthographic",A.isOrthographicCamera===!0),S!==A&&(S=A,ys=!0,so=!0)}if(W.isSkinnedMesh){Bt.setOptional(G,W,"bindMatrix"),Bt.setOptional(G,W,"bindMatrixInverse");const rn=W.skeleton;rn&&(Ue.floatVertexTextures?(rn.boneTexture===null&&rn.computeBoneTexture(),Bt.setValue(G,"boneTexture",rn.boneTexture,R)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}W.isBatchedMesh&&(Bt.setOptional(G,W,"batchingTexture"),Bt.setValue(G,"batchingTexture",W._matricesTexture,R));const ro=X.morphAttributes;if((ro.position!==void 0||ro.normal!==void 0||ro.color!==void 0&&Ue.isWebGL2===!0)&&je.update(W,X,oi),(ys||Je.receiveShadow!==W.receiveShadow)&&(Je.receiveShadow=W.receiveShadow,Bt.setValue(G,"receiveShadow",W.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(ai.envMap.value=ze,ai.flipEnvMap.value=ze.isCubeTexture&&ze.isRenderTargetTexture===!1?-1:1),ys&&(Bt.setValue(G,"toneMappingExposure",v.toneMappingExposure),Je.needsLights&&Bu(ai,so),me&&Y.fog===!0&&fe.refreshFogUniforms(ai,me),fe.refreshMaterialUniforms(ai,Y,q,H,ve),Nr.upload(G,Ya(Je),ai,R)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Nr.upload(G,Ya(Je),ai,R),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&Bt.setValue(G,"center",W.center),Bt.setValue(G,"modelViewMatrix",W.modelViewMatrix),Bt.setValue(G,"normalMatrix",W.normalMatrix),Bt.setValue(G,"modelMatrix",W.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){const rn=Y.uniformsGroups;for(let oo=0,Hu=rn.length;oo<Hu;oo++)if(Ue.isWebGL2){const Za=rn[oo];ae.update(Za,oi),ae.bind(Za,oi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return oi}function Bu(A,B){A.ambientLightColor.needsUpdate=B,A.lightProbe.needsUpdate=B,A.directionalLights.needsUpdate=B,A.directionalLightShadows.needsUpdate=B,A.pointLights.needsUpdate=B,A.pointLightShadows.needsUpdate=B,A.spotLights.needsUpdate=B,A.spotLightShadows.needsUpdate=B,A.rectAreaLights.needsUpdate=B,A.hemisphereLights.needsUpdate=B}function zu(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return y},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(A,B,X){ke.get(A.texture).__webglTexture=B,ke.get(A.depthTexture).__webglTexture=X;const Y=ke.get(A);Y.__hasExternalTextures=!0,Y.__hasExternalTextures&&(Y.__autoAllocateDepthBuffer=X===void 0,Y.__autoAllocateDepthBuffer||be.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Y.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(A,B){const X=ke.get(A);X.__webglFramebuffer=B,X.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(A,B=0,X=0){w=A,y=B,b=X;let Y=!0,W=null,me=!1,Ee=!1;if(A){const ze=ke.get(A);ze.__useDefaultFramebuffer!==void 0?(Me.bindFramebuffer(G.FRAMEBUFFER,null),Y=!1):ze.__webglFramebuffer===void 0?R.setupRenderTarget(A):ze.__hasExternalTextures&&R.rebindTextures(A,ke.get(A.texture).__webglTexture,ke.get(A.depthTexture).__webglTexture);const Ze=A.texture;(Ze.isData3DTexture||Ze.isDataArrayTexture||Ze.isCompressedArrayTexture)&&(Ee=!0);const Ge=ke.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Ge[B])?W=Ge[B][X]:W=Ge[B],me=!0):Ue.isWebGL2&&A.samples>0&&R.useMultisampledRTT(A)===!1?W=ke.get(A).__webglMultisampledFramebuffer:Array.isArray(Ge)?W=Ge[X]:W=Ge,E.copy(A.viewport),L.copy(A.scissor),F=A.scissorTest}else E.copy($).multiplyScalar(q).floor(),L.copy(te).multiplyScalar(q).floor(),F=se;if(Me.bindFramebuffer(G.FRAMEBUFFER,W)&&Ue.drawBuffers&&Y&&Me.drawBuffers(A,W),Me.viewport(E),Me.scissor(L),Me.setScissorTest(F),me){const ze=ke.get(A.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+B,ze.__webglTexture,X)}else if(Ee){const ze=ke.get(A.texture),Ze=B||0;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,ze.__webglTexture,X||0,Ze)}U=-1},this.readRenderTargetPixels=function(A,B,X,Y,W,me,Ee){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Oe=ke.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ee!==void 0&&(Oe=Oe[Ee]),Oe){Me.bindFramebuffer(G.FRAMEBUFFER,Oe);try{const ze=A.texture,Ze=ze.format,Ge=ze.type;if(Ze!==hn&&pe.convert(Ze)!==G.getParameter(G.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Xe=Ge===zs&&(be.has("EXT_color_buffer_half_float")||Ue.isWebGL2&&be.has("EXT_color_buffer_float"));if(Ge!==ii&&pe.convert(Ge)!==G.getParameter(G.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ge===Nn&&(Ue.isWebGL2||be.has("OES_texture_float")||be.has("WEBGL_color_buffer_float")))&&!Xe){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=A.width-Y&&X>=0&&X<=A.height-W&&G.readPixels(B,X,Y,W,pe.convert(Ze),pe.convert(Ge),me)}finally{const ze=w!==null?ke.get(w).__webglFramebuffer:null;Me.bindFramebuffer(G.FRAMEBUFFER,ze)}}},this.copyFramebufferToTexture=function(A,B,X=0){const Y=Math.pow(2,-X),W=Math.floor(B.image.width*Y),me=Math.floor(B.image.height*Y);R.setTexture2D(B,0),G.copyTexSubImage2D(G.TEXTURE_2D,X,0,0,A.x,A.y,W,me),Me.unbindTexture()},this.copyTextureToTexture=function(A,B,X,Y=0){const W=B.image.width,me=B.image.height,Ee=pe.convert(X.format),Oe=pe.convert(X.type);R.setTexture2D(X,0),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,X.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,X.unpackAlignment),B.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,Y,A.x,A.y,W,me,Ee,Oe,B.image.data):B.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,Y,A.x,A.y,B.mipmaps[0].width,B.mipmaps[0].height,Ee,B.mipmaps[0].data):G.texSubImage2D(G.TEXTURE_2D,Y,A.x,A.y,Ee,Oe,B.image),Y===0&&X.generateMipmaps&&G.generateMipmap(G.TEXTURE_2D),Me.unbindTexture()},this.copyTextureToTexture3D=function(A,B,X,Y,W=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const me=A.max.x-A.min.x+1,Ee=A.max.y-A.min.y+1,Oe=A.max.z-A.min.z+1,ze=pe.convert(Y.format),Ze=pe.convert(Y.type);let Ge;if(Y.isData3DTexture)R.setTexture3D(Y,0),Ge=G.TEXTURE_3D;else if(Y.isDataArrayTexture||Y.isCompressedArrayTexture)R.setTexture2DArray(Y,0),Ge=G.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,Y.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,Y.unpackAlignment);const Xe=G.getParameter(G.UNPACK_ROW_LENGTH),Et=G.getParameter(G.UNPACK_IMAGE_HEIGHT),Kt=G.getParameter(G.UNPACK_SKIP_PIXELS),It=G.getParameter(G.UNPACK_SKIP_ROWS),An=G.getParameter(G.UNPACK_SKIP_IMAGES),_t=X.isCompressedTexture?X.mipmaps[W]:X.image;G.pixelStorei(G.UNPACK_ROW_LENGTH,_t.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,_t.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,A.min.x),G.pixelStorei(G.UNPACK_SKIP_ROWS,A.min.y),G.pixelStorei(G.UNPACK_SKIP_IMAGES,A.min.z),X.isDataTexture||X.isData3DTexture?G.texSubImage3D(Ge,W,B.x,B.y,B.z,me,Ee,Oe,ze,Ze,_t.data):X.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),G.compressedTexSubImage3D(Ge,W,B.x,B.y,B.z,me,Ee,Oe,ze,_t.data)):G.texSubImage3D(Ge,W,B.x,B.y,B.z,me,Ee,Oe,ze,Ze,_t),G.pixelStorei(G.UNPACK_ROW_LENGTH,Xe),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Et),G.pixelStorei(G.UNPACK_SKIP_PIXELS,Kt),G.pixelStorei(G.UNPACK_SKIP_ROWS,It),G.pixelStorei(G.UNPACK_SKIP_IMAGES,An),W===0&&Y.generateMipmaps&&G.generateMipmap(Ge),Me.unbindTexture()},this.initTexture=function(A){A.isCubeTexture?R.setTextureCube(A,0):A.isData3DTexture?R.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?R.setTexture2DArray(A,0):R.setTexture2D(A,0),Me.unbindTexture()},this.resetState=function(){y=0,b=0,w=null,Me.reset(),I.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Ea?"display-p3":"srgb",t.unpackColorSpace=lt.workingColorSpace===Kr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Tt?Mi:Hh}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===Mi?Tt:zn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class f_ extends su{}f_.prototype.isWebGL1Renderer=!0;class p_ extends dt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}const Sc=new C,Ec=new ot,bc=new ot,m_=new C,wc=new Te,Sr=new C,Bo=new gs,Tc=new Te,zo=new js;class g_ extends ce{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=sl,this.bindMatrix=new Te,this.bindMatrixInverse=new Te,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Li),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Sr),this.boundingBox.expandByPoint(Sr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new gs),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Sr),this.boundingSphere.expandByPoint(Sr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Bo.copy(this.boundingSphere),Bo.applyMatrix4(i),e.ray.intersectsSphere(Bo)!==!1&&(Tc.copy(i).invert(),zo.copy(e.ray).applyMatrix4(Tc),!(this.boundingBox!==null&&zo.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,zo)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new ot,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===sl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Td?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Ec.fromBufferAttribute(i.attributes.skinIndex,e),bc.fromBufferAttribute(i.attributes.skinWeight,e),Sc.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const o=bc.getComponent(r);if(o!==0){const a=Ec.getComponent(r);wc.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(m_.copy(Sc).applyMatrix4(wc),o)}}return t.applyMatrix4(this.bindMatrixInverse)}boneTransform(e,t){return console.warn("THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151."),this.applyBoneTransform(e,t)}}class ha extends dt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class __ extends Ft{constructor(e=null,t=1,n=1,i,r,o,a,l,c=Ot,h=Ot,u,d){super(null,o,a,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ac=new Te,v_=new Te;class Ca{constructor(e=[],t=[]){this.uuid=ri(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Te)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Te;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=e.length;r<o;r++){const a=e[r]?e[r].matrixWorld:v_;Ac.multiplyMatrices(a,t[r]),Ac.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Ca(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new __(t,e,e,hn,Nn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new ha),this.bones.push(o),this.boneInverses.push(new Te().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const o=t[i];e.bones.push(o.uuid);const a=n[i];e.boneInverses.push(a.toArray())}return e}}class jn extends Ii{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new He(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Pc=new C,Rc=new C,Cc=new Te,Ho=new js,Er=new gs;class _n extends dt{constructor(e=new yt,t=new jn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Pc.fromBufferAttribute(t,i-1),Rc.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Pc.distanceTo(Rc);e.setAttribute("lineDistance",new nt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Er.copy(n.boundingSphere),Er.applyMatrix4(i),Er.radius+=r,e.ray.intersectsSphere(Er)===!1)return;Cc.copy(i).invert(),Ho.copy(e.ray).applyMatrix4(Cc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new C,h=new C,u=new C,d=new C,p=this.isLineSegments?2:1,g=n.index,m=n.attributes.position;if(g!==null){const f=Math.max(0,o.start),x=Math.min(g.count,o.start+o.count);for(let v=f,M=x-1;v<M;v+=p){const y=g.getX(v),b=g.getX(v+1);if(c.fromBufferAttribute(m,y),h.fromBufferAttribute(m,b),Ho.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const U=e.ray.origin.distanceTo(d);U<e.near||U>e.far||t.push({distance:U,point:u.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}else{const f=Math.max(0,o.start),x=Math.min(m.count,o.start+o.count);for(let v=f,M=x-1;v<M;v+=p){if(c.fromBufferAttribute(m,v),h.fromBufferAttribute(m,v+1),Ho.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const b=e.ray.origin.distanceTo(d);b<e.near||b>e.far||t.push({distance:b,point:u.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const Lc=new C,Ic=new C;class br extends _n{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Lc.fromBufferAttribute(t,i),Ic.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Lc.distanceTo(Ic);e.setAttribute("lineDistance",new nt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class x_{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let i=0;const r=n.length;let o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);const h=n[i],d=n[i+1]-h,p=(o-h)/d;return(i+p)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const o=this.getPoint(i),a=this.getPoint(r),l=t||(o.isVector2?new Le:new C);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new C,i=[],r=[],o=[],a=new C,l=new Te;for(let p=0;p<=e;p++){const g=p/e;i[p]=this.getTangentAt(g,new C)}r[0]=new C,o[0]=new C;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(i[p-1],i[p]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Ut(i[p-1].dot(i[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(a,g))}o[p].crossVectors(i[p],r[p])}if(t===!0){let p=Math.acos(Ut(r[0].dot(r[e]),-1,1));p/=e,i[0].dot(a.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],p*g)),o[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class bt extends yt{constructor(e=1,t=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],p=[];let g=0;const _=[],m=n/2;let f=0;x(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new nt(u,3)),this.setAttribute("normal",new nt(d,3)),this.setAttribute("uv",new nt(p,2));function x(){const M=new C,y=new C;let b=0;const w=(t-e)/n;for(let U=0;U<=r;U++){const S=[],E=U/r,L=E*(t-e)+e;for(let F=0;F<=i;F++){const z=F/i,D=z*l+a,O=Math.sin(D),H=Math.cos(D);y.x=L*O,y.y=-E*n+m,y.z=L*H,u.push(y.x,y.y,y.z),M.set(O,w,H).normalize(),d.push(M.x,M.y,M.z),p.push(z,1-E),S.push(g++)}_.push(S)}for(let U=0;U<i;U++)for(let S=0;S<r;S++){const E=_[S][U],L=_[S+1][U],F=_[S+1][U+1],z=_[S][U+1];h.push(E,L,z),h.push(L,F,z),b+=6}c.addGroup(f,b,0),f+=b}function v(M){const y=g,b=new Le,w=new C;let U=0;const S=M===!0?e:t,E=M===!0?1:-1;for(let F=1;F<=i;F++)u.push(0,m*E,0),d.push(0,E,0),p.push(.5,.5),g++;const L=g;for(let F=0;F<=i;F++){const D=F/i*l+a,O=Math.cos(D),H=Math.sin(D);w.x=S*H,w.y=m*E,w.z=S*O,u.push(w.x,w.y,w.z),d.push(0,E,0),b.x=O*.5+.5,b.y=H*.5*E+.5,p.push(b.x,b.y),g++}for(let F=0;F<i;F++){const z=y+F,D=L+F;M===!0?h.push(D,D+1,z):h.push(D+1,D,z),U+=3}c.addGroup(f,U,M===!0?1:2),f+=U}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Qr extends bt{constructor(e=1,t=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Qr(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class La extends yt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new nt(r,3)),this.setAttribute("normal",new nt(r.slice(),3)),this.setAttribute("uv",new nt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(x){const v=new C,M=new C,y=new C;for(let b=0;b<t.length;b+=3)p(t[b+0],v),p(t[b+1],M),p(t[b+2],y),l(v,M,y,x)}function l(x,v,M,y){const b=y+1,w=[];for(let U=0;U<=b;U++){w[U]=[];const S=x.clone().lerp(M,U/b),E=v.clone().lerp(M,U/b),L=b-U;for(let F=0;F<=L;F++)F===0&&U===b?w[U][F]=S:w[U][F]=S.clone().lerp(E,F/L)}for(let U=0;U<b;U++)for(let S=0;S<2*(b-U)-1;S++){const E=Math.floor(S/2);S%2===0?(d(w[U][E+1]),d(w[U+1][E]),d(w[U][E])):(d(w[U][E+1]),d(w[U+1][E+1]),d(w[U+1][E]))}}function c(x){const v=new C;for(let M=0;M<r.length;M+=3)v.x=r[M+0],v.y=r[M+1],v.z=r[M+2],v.normalize().multiplyScalar(x),r[M+0]=v.x,r[M+1]=v.y,r[M+2]=v.z}function h(){const x=new C;for(let v=0;v<r.length;v+=3){x.x=r[v+0],x.y=r[v+1],x.z=r[v+2];const M=m(x)/2/Math.PI+.5,y=f(x)/Math.PI+.5;o.push(M,1-y)}g(),u()}function u(){for(let x=0;x<o.length;x+=6){const v=o[x+0],M=o[x+2],y=o[x+4],b=Math.max(v,M,y),w=Math.min(v,M,y);b>.9&&w<.1&&(v<.2&&(o[x+0]+=1),M<.2&&(o[x+2]+=1),y<.2&&(o[x+4]+=1))}}function d(x){r.push(x.x,x.y,x.z)}function p(x,v){const M=x*3;v.x=e[M+0],v.y=e[M+1],v.z=e[M+2]}function g(){const x=new C,v=new C,M=new C,y=new C,b=new Le,w=new Le,U=new Le;for(let S=0,E=0;S<r.length;S+=9,E+=6){x.set(r[S+0],r[S+1],r[S+2]),v.set(r[S+3],r[S+4],r[S+5]),M.set(r[S+6],r[S+7],r[S+8]),b.set(o[E+0],o[E+1]),w.set(o[E+2],o[E+3]),U.set(o[E+4],o[E+5]),y.copy(x).add(v).add(M).divideScalar(3);const L=m(y);_(b,E+0,x,L),_(w,E+2,v,L),_(U,E+4,M,L)}}function _(x,v,M,y){y<0&&x.x===1&&(o[v]=x.x-1),M.x===0&&M.z===0&&(o[v]=y/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function f(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new La(e.vertices,e.indices,e.radius,e.details)}}const wr=new C,Tr=new C,ko=new C,Ar=new cn;class Dc extends yt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),r=Math.cos(cs*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},p=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:_,b:m,c:f}=Ar;if(_.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),f.fromBufferAttribute(a,c[2]),Ar.getNormal(ko),u[0]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,u[1]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,u[2]=`${Math.round(f.x*i)},${Math.round(f.y*i)},${Math.round(f.z*i)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let x=0;x<3;x++){const v=(x+1)%3,M=u[x],y=u[v],b=Ar[h[x]],w=Ar[h[v]],U=`${M}_${y}`,S=`${y}_${M}`;S in d&&d[S]?(ko.dot(d[S].normal)<=r&&(p.push(b.x,b.y,b.z),p.push(w.x,w.y,w.z)),d[S]=null):U in d||(d[U]={index0:c[x],index1:c[v],normal:ko.clone()})}}for(const g in d)if(d[g]){const{index0:_,index1:m}=d[g];wr.fromBufferAttribute(a,_),Tr.fromBufferAttribute(a,m),p.push(wr.x,wr.y,wr.z),p.push(Tr.x,Tr.y,Tr.z)}this.setAttribute("position",new nt(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}const M_={triangulate:function(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=ru(s,0,i,t,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,u,d,p;if(n&&(r=w_(s,e,r,t)),s.length>80*t){a=c=s[0],l=h=s[1];for(let g=t;g<i;g+=t)u=s[g],d=s[g+1],u<a&&(a=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);p=Math.max(c-a,h-l),p=p!==0?32767/p:0}return ks(r,o,t,a,l,p,0),o}};function ru(s,e,t,n,i){let r,o;if(i===N_(s,e,t,n)>0)for(r=e;r<t;r+=n)o=Uc(r,s[r],s[r+1],o);else for(r=t-n;r>=e;r-=n)o=Uc(r,s[r],s[r+1],o);return o&&Jr(o,o.next)&&(Vs(o),o=o.next),o}function Ti(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(Jr(t,t.next)||vt(t.prev,t,t.next)===0)){if(Vs(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function ks(s,e,t,n,i,r,o){if(!s)return;!o&&r&&C_(s,n,i,r);let a=s,l,c;for(;s.prev!==s.next;){if(l=s.prev,c=s.next,r?S_(s,n,i,r):y_(s)){e.push(l.i/t|0),e.push(s.i/t|0),e.push(c.i/t|0),Vs(s),s=c.next,a=c.next;continue}if(s=c,s===a){o?o===1?(s=E_(Ti(s),e,t),ks(s,e,t,n,i,r,2)):o===2&&b_(s,e,t,n,i,r):ks(Ti(s),e,t,n,i,r,1);break}}}function y_(s){const e=s.prev,t=s,n=s.next;if(vt(e,t,n)>=0)return!1;const i=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=i<r?i<o?i:o:r<o?r:o,u=a<l?a<c?a:c:l<c?l:c,d=i>r?i>o?i:o:r>o?r:o,p=a>l?a>c?a:c:l>c?l:c;let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=p&&os(i,a,r,l,o,c,g.x,g.y)&&vt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function S_(s,e,t,n){const i=s.prev,r=s,o=s.next;if(vt(i,r,o)>=0)return!1;const a=i.x,l=r.x,c=o.x,h=i.y,u=r.y,d=o.y,p=a<l?a<c?a:c:l<c?l:c,g=h<u?h<d?h:d:u<d?u:d,_=a>l?a>c?a:c:l>c?l:c,m=h>u?h>d?h:d:u>d?u:d,f=ua(p,g,e,t,n),x=ua(_,m,e,t,n);let v=s.prevZ,M=s.nextZ;for(;v&&v.z>=f&&M&&M.z<=x;){if(v.x>=p&&v.x<=_&&v.y>=g&&v.y<=m&&v!==i&&v!==o&&os(a,h,l,u,c,d,v.x,v.y)&&vt(v.prev,v,v.next)>=0||(v=v.prevZ,M.x>=p&&M.x<=_&&M.y>=g&&M.y<=m&&M!==i&&M!==o&&os(a,h,l,u,c,d,M.x,M.y)&&vt(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;v&&v.z>=f;){if(v.x>=p&&v.x<=_&&v.y>=g&&v.y<=m&&v!==i&&v!==o&&os(a,h,l,u,c,d,v.x,v.y)&&vt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;M&&M.z<=x;){if(M.x>=p&&M.x<=_&&M.y>=g&&M.y<=m&&M!==i&&M!==o&&os(a,h,l,u,c,d,M.x,M.y)&&vt(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function E_(s,e,t){let n=s;do{const i=n.prev,r=n.next.next;!Jr(i,r)&&ou(i,n,n.next,r)&&Gs(i,r)&&Gs(r,i)&&(e.push(i.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),Vs(n),Vs(n.next),n=s=r),n=n.next}while(n!==s);return Ti(n)}function b_(s,e,t,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&D_(o,a)){let l=au(o,a);o=Ti(o,o.next),l=Ti(l,l.next),ks(o,e,t,n,i,r,0),ks(l,e,t,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function w_(s,e,t,n){const i=[];let r,o,a,l,c;for(r=0,o=e.length;r<o;r++)a=e[r]*n,l=r<o-1?e[r+1]*n:s.length,c=ru(s,a,l,n,!1),c===c.next&&(c.steiner=!0),i.push(I_(c));for(i.sort(T_),r=0;r<i.length;r++)t=A_(i[r],t);return t}function T_(s,e){return s.x-e.x}function A_(s,e){const t=P_(s,e);if(!t)return e;const n=au(t,s);return Ti(n,n.next),Ti(t,t.next)}function P_(s,e){let t=e,n=-1/0,i;const r=s.x,o=s.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const d=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=r&&d>n&&(n=d,i=t.x<t.next.x?t:t.next,d===r))return i}t=t.next}while(t!==e);if(!i)return null;const a=i,l=i.x,c=i.y;let h=1/0,u;t=i;do r>=t.x&&t.x>=l&&r!==t.x&&os(o<c?r:n,o,l,c,o<c?n:r,o,t.x,t.y)&&(u=Math.abs(o-t.y)/(r-t.x),Gs(t,s)&&(u<h||u===h&&(t.x>i.x||t.x===i.x&&R_(i,t)))&&(i=t,h=u)),t=t.next;while(t!==a);return i}function R_(s,e){return vt(s.prev,s,e.prev)<0&&vt(e.next,s,s.next)<0}function C_(s,e,t,n){let i=s;do i.z===0&&(i.z=ua(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,L_(i)}function L_(s){let e,t,n,i,r,o,a,l,c=1;do{for(t=s,s=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<c&&(a++,n=n.nextZ,!!n);e++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,a--):(i=n,n=n.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;t=n}r.nextZ=null,c*=2}while(o>1);return s}function ua(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function I_(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function os(s,e,t,n,i,r,o,a){return(i-o)*(e-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(i-o)*(n-a)}function D_(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!U_(s,e)&&(Gs(s,e)&&Gs(e,s)&&F_(s,e)&&(vt(s.prev,s,e.prev)||vt(s,e.prev,e))||Jr(s,e)&&vt(s.prev,s,s.next)>0&&vt(e.prev,e,e.next)>0)}function vt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function Jr(s,e){return s.x===e.x&&s.y===e.y}function ou(s,e,t,n){const i=Rr(vt(s,e,t)),r=Rr(vt(s,e,n)),o=Rr(vt(t,n,s)),a=Rr(vt(t,n,e));return!!(i!==r&&o!==a||i===0&&Pr(s,t,e)||r===0&&Pr(s,n,e)||o===0&&Pr(t,s,n)||a===0&&Pr(t,e,n))}function Pr(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Rr(s){return s>0?1:s<0?-1:0}function U_(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&ou(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function Gs(s,e){return vt(s.prev,s,s.next)<0?vt(s,e,s.next)>=0&&vt(s,s.prev,e)>=0:vt(s,e,s.prev)<0||vt(s,s.next,e)<0}function F_(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function au(s,e){const t=new da(s.i,s.x,s.y),n=new da(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Uc(s,e,t,n){const i=new da(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Vs(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function da(s,e,t){this.i=s,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function N_(s,e,t,n){let i=0;for(let r=e,o=t-n;r<t;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}class Ia{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return Ia.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];Fc(e),Nc(n,e);let o=e.length;t.forEach(Fc);for(let l=0;l<t.length;l++)i.push(o),o+=t[l].length,Nc(n,t[l]);const a=M_.triangulate(n,i);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function Fc(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function Nc(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class as extends La{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new as(e.radius,e.detail)}}class Ai extends yt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new C,d=new C,p=[],g=[],_=[],m=[];for(let f=0;f<=n;f++){const x=[],v=f/n;let M=0;f===0&&o===0?M=.5/t:f===n&&l===Math.PI&&(M=-.5/t);for(let y=0;y<=t;y++){const b=y/t;u.x=-e*Math.cos(i+b*r)*Math.sin(o+v*a),u.y=e*Math.cos(o+v*a),u.z=e*Math.sin(i+b*r)*Math.sin(o+v*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(b+M,1-v),x.push(c++)}h.push(x)}for(let f=0;f<n;f++)for(let x=0;x<t;x++){const v=h[f][x+1],M=h[f][x],y=h[f+1][x],b=h[f+1][x+1];(f!==0||o>0)&&p.push(v,M,b),(f!==n-1||l<Math.PI)&&p.push(M,y,b)}this.setIndex(p),this.setAttribute("position",new nt(g,3)),this.setAttribute("normal",new nt(_,3)),this.setAttribute("uv",new nt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ai(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class _i extends yt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const o=[],a=[],l=[],c=[],h=new C,u=new C,d=new C;for(let p=0;p<=n;p++)for(let g=0;g<=i;g++){const _=g/i*r,m=p/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(_),u.y=(e+t*Math.cos(m))*Math.sin(_),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/i),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=i;g++){const _=(i+1)*p+g-1,m=(i+1)*(p-1)+g-1,f=(i+1)*(p-1)+g,x=(i+1)*p+g;o.push(_,m,x),o.push(m,f,x)}this.setIndex(o),this.setAttribute("position",new nt(a,3)),this.setAttribute("normal",new nt(l,3)),this.setAttribute("uv",new nt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Go extends Ii{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new He(16777215),this.specular=new He(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new He(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sa,this.normalScale=new Le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=jr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Fs extends Ii{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new He(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new He(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sa,this.normalScale=new Le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=jr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}function Cr(s,e,t){return!s||!t&&s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function O_(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function B_(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Oc(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){const a=t[r]*e;for(let l=0;l!==e;++l)i[o++]=s[a+l]}return i}function lu(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push.apply(t,o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=s[i++];while(r!==void 0)}class eo{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=t[++n],e<i)break e}o=t.length;break t}if(!(e>=r)){const a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let o=0;o!==i;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class z_ extends eo{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ll,endingEnd:Ll}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,o=e+1,a=i[r],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case Il:r=e,a=2*t-n;break;case Dl:r=i.length-2,a=t+i[r]-i[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Il:o=e,l=2*n-t;break;case Dl:o=1,l=n+i[1]-i[0];break;default:o=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(n-t)/(i-t),_=g*g,m=_*g,f=-d*m+2*d*_-d*g,x=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,v=(-1-p)*m+(1.5+p)*_+.5*g,M=p*m-p*_;for(let y=0;y!==a;++y)r[y]=f*o[h+y]+x*o[c+y]+v*o[l+y]+M*o[u+y];return r}}class H_ extends eo{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}}class k_ extends eo{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Tn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Cr(t,this.TimeBufferType),this.values=Cr(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Cr(e.times,Array),values:Cr(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new k_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new H_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new z_(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Hr:t=this.InterpolantFactoryMethodDiscrete;break;case kr:t=this.InterpolantFactoryMethodLinear;break;case po:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Hr;case this.InterpolantFactoryMethodLinear:return kr;case this.InterpolantFactoryMethodSmooth:return po}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,o=i-1;for(;r!==i&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){const l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(i!==void 0&&O_(i))for(let a=0,l=i.length;a!==l;++a){const c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===po,r=e.length-1;let o=1;for(let a=1;a<r;++a){let l=!1;const c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(i)l=!0;else{const u=a*n,d=u-n,p=u+n;for(let g=0;g!==n;++g){const _=t[u+g];if(_!==t[d+g]||_!==t[p+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];const u=a*n,d=o*n;for(let p=0;p!==n;++p)t[d+p]=t[u+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}Tn.prototype.TimeBufferType=Float32Array;Tn.prototype.ValueBufferType=Float32Array;Tn.prototype.DefaultInterpolation=kr;class vs extends Tn{}vs.prototype.ValueTypeName="bool";vs.prototype.ValueBufferType=Array;vs.prototype.DefaultInterpolation=Hr;vs.prototype.InterpolantFactoryMethodLinear=void 0;vs.prototype.InterpolantFactoryMethodSmooth=void 0;class cu extends Tn{}cu.prototype.ValueTypeName="color";class Ws extends Tn{}Ws.prototype.ValueTypeName="number";class G_ extends eo{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(i-t);let c=e*a;for(let h=c+a;c!==h;c+=4)ut.slerpFlat(r,0,o,c-a,o,c,l);return r}}class Pi extends Tn{InterpolantFactoryMethodLinear(e){return new G_(this.times,this.values,this.getValueSize(),e)}}Pi.prototype.ValueTypeName="quaternion";Pi.prototype.DefaultInterpolation=kr;Pi.prototype.InterpolantFactoryMethodSmooth=void 0;class xs extends Tn{}xs.prototype.ValueTypeName="string";xs.prototype.ValueBufferType=Array;xs.prototype.DefaultInterpolation=Hr;xs.prototype.InterpolantFactoryMethodLinear=void 0;xs.prototype.InterpolantFactoryMethodSmooth=void 0;class Xs extends Tn{}Xs.prototype.ValueTypeName="vector";class V_{constructor(e,t=-1,n,i=Nd){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=ri(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(X_(n[o]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,o=n.length;r!==o;++r)t.push(Tn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);const h=B_(l);l=Oc(l,1,h),c=Oc(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new Ws(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){const c=e[a],h=c.name.match(r);if(h&&h.length>1){const u=h[1];let d=i[u];d||(i[u]=d=[]),d.push(c)}}const o=[];for(const a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,p,g,_){if(p.length!==0){const m=[],f=[];lu(p,m,f,g),m.length!==0&&_.push(new u(d,m,f))}},i=[],r=e.name||"default",o=e.fps||30,a=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let u=0;u<c.length;u++){const d=c[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const p={};let g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let _=0;_<d[g].morphTargets.length;_++)p[d[g].morphTargets[_]]=-1;for(const _ in p){const m=[],f=[];for(let x=0;x!==d[g].morphTargets.length;++x){const v=d[g];m.push(v.time),f.push(v.morphTarget===_?1:0)}i.push(new Ws(".morphTargetInfluence["+_+"]",m,f))}l=p.length*o}else{const p=".bones["+t[u].name+"]";n(Xs,p+".position",d,"pos",i),n(Pi,p+".quaternion",d,"rot",i),n(Xs,p+".scale",d,"scl",i)}}return i.length===0?null:new this(r,l,i,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function W_(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ws;case"vector":case"vector2":case"vector3":case"vector4":return Xs;case"color":return cu;case"quaternion":return Pi;case"bool":case"boolean":return vs;case"string":return xs}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function X_(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=W_(s.type);if(s.times===void 0){const t=[],n=[];lu(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const qr={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class Y_{constructor(e,t,n){const i=this;let r=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const p=c[u],g=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}}const q_=new Y_;class Ri{constructor(e){this.manager=e!==void 0?e:q_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Ri.DEFAULT_MATERIAL_NAME="__DEFAULT";const Dn={};class j_ extends Error{constructor(e,t){super(e),this.response=t}}class Z_ extends Ri{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=qr.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Dn[e]!==void 0){Dn[e].push({onLoad:t,onProgress:n,onError:i});return}Dn[e]=[],Dn[e].push({onLoad:t,onProgress:n,onError:i});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=Dn[e],u=c.body.getReader(),d=c.headers.get("Content-Length")||c.headers.get("X-File-Size"),p=d?parseInt(d):0,g=p!==0;let _=0;const m=new ReadableStream({start(f){x();function x(){u.read().then(({done:v,value:M})=>{if(v)f.close();else{_+=M.byteLength;const y=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:p});for(let b=0,w=h.length;b<w;b++){const U=h[b];U.onProgress&&U.onProgress(y)}f.enqueue(M),x()}})}}});return new Response(m)}else throw new j_(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return c.json();default:if(a===void 0)return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,p=new TextDecoder(d);return c.arrayBuffer().then(g=>p.decode(g))}}}).then(c=>{qr.add(e,c);const h=Dn[e];delete Dn[e];for(let u=0,d=h.length;u<d;u++){const p=h[u];p.onLoad&&p.onLoad(c)}}).catch(c=>{const h=Dn[e];if(h===void 0)throw this.manager.itemError(e),c;delete Dn[e];for(let u=0,d=h.length;u<d;u++){const p=h[u];p.onError&&p.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class K_ extends Ri{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=qr.get(e);if(o!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o;const a=Hs("img");function l(){h(),qr.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(u){h(),i&&i(u),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(e),a.src=e,a}}class $_ extends Ri{constructor(e){super(e)}load(e,t,n,i){const r=new Ft,o=new K_(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class to extends dt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new He(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const Vo=new Te,Bc=new C,zc=new C;class Da{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Le(512,512),this.map=null,this.mapPass=null,this.matrix=new Te,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Aa,this._frameExtents=new Le(1,1),this._viewportCount=1,this._viewports=[new ot(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Bc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Bc),zc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(zc),t.updateMatrixWorld(),Vo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Vo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Vo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Q_ extends Da{constructor(){super(new qt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=ps*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class J_ extends to{constructor(e,t,n=0,i=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(dt.DEFAULT_UP),this.updateMatrix(),this.target=new dt,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Q_}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Hc=new Te,As=new C,Wo=new C;class ev extends Da{constructor(){super(new qt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Le(4,2),this._viewportCount=6,this._viewports=[new ot(2,1,1,1),new ot(0,1,1,1),new ot(3,1,1,1),new ot(1,1,1,1),new ot(3,0,1,1),new ot(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),As.setFromMatrixPosition(e.matrixWorld),n.position.copy(As),Wo.copy(n.position),Wo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Wo),n.updateMatrixWorld(),i.makeTranslation(-As.x,-As.y,-As.z),Hc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Hc)}}class kc extends to{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new ev}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class tv extends Da{constructor(){super(new Pa(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class hu extends to{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(dt.DEFAULT_UP),this.updateMatrix(),this.target=new dt,this.shadow=new tv}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class uu extends to{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class nv{static decodeText(e){if(typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Ua="\\[\\]\\.:\\/",iv=new RegExp("["+Ua+"]","g"),Fa="[^"+Ua+"]",sv="[^"+Ua.replace("\\.","")+"]",rv=/((?:WC+[\/:])*)/.source.replace("WC",Fa),ov=/(WCOD+)?/.source.replace("WCOD",sv),av=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Fa),lv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Fa),cv=new RegExp("^"+rv+ov+av+lv+"$"),hv=["material","materials","bones","map"];class uv{constructor(e,t,n){const i=n||st.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class st{constructor(e,t,n){this.path=t,this.parsedPath=n||st.parseTrackName(t),this.node=st.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new st.Composite(e,t,n):new st(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(iv,"")}static parseTrackName(e){const t=cv.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);hv.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===t||a.uuid===t)return a;const l=n(a.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=st.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const o=e[i];if(o===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}st.Composite=uv;st.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};st.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};st.prototype.GetterByBindingType=[st.prototype._getValue_direct,st.prototype._getValue_array,st.prototype._getValue_arrayElement,st.prototype._getValue_toArray];st.prototype.SetterByBindingTypeAndVersioning=[[st.prototype._setValue_direct,st.prototype._setValue_direct_setNeedsUpdate,st.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[st.prototype._setValue_array,st.prototype._setValue_array_setNeedsUpdate,st.prototype._setValue_array_setMatrixWorldNeedsUpdate],[st.prototype._setValue_arrayElement,st.prototype._setValue_arrayElement_setNeedsUpdate,st.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[st.prototype._setValue_fromArray,st.prototype._setValue_fromArray_setNeedsUpdate,st.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Zs{constructor(e,t,n=0,i=1/0){this.ray=new js(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new wa,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return fa(e,this,n,t),n.sort(Gc),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)fa(e[i],this,n,t);return n.sort(Gc),n}}function Gc(s,e){return s.distance-e.distance}function fa(s,e,t,n){if(s.layers.test(e.layers)&&s.raycast(e,t),n===!0){const i=s.children;for(let r=0,o=i.length;r<o;r++)fa(i[r],e,t,!0)}}class Vc{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ut(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ma}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ma);const Wc={type:"change"},Xo={type:"start"},Xc={type:"end"},Lr=new js,Yc=new qn,dv=Math.cos(70*Gt.DEG2RAD);class fv extends Ci{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Jt.ROTATE,MIDDLE:Jt.DOLLY,RIGHT:Jt.PAN},this.touches={ONE:Fi.ROTATE,TWO:Fi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(I){I.addEventListener("keydown",De),this._domElementKeyEvents=I},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",De),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Wc),n.update(),r=i.NONE},this.update=function(){const I=new C,ae=new ut().setFromUnitVectors(e.up,new C(0,1,0)),Se=ae.clone().invert(),_e=new C,ie=new ut,N=new C,le=2*Math.PI;return function(Ne=null){const Ie=n.object.position;I.copy(Ie).sub(n.target),I.applyQuaternion(ae),a.setFromVector3(I),n.autoRotate&&r===i.NONE&&F(E(Ne)),n.enableDamping?(a.theta+=l.theta*n.dampingFactor,a.phi+=l.phi*n.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let et=n.minAzimuthAngle,tt=n.maxAzimuthAngle;isFinite(et)&&isFinite(tt)&&(et<-Math.PI?et+=le:et>Math.PI&&(et-=le),tt<-Math.PI?tt+=le:tt>Math.PI&&(tt-=le),et<=tt?a.theta=Math.max(et,Math.min(tt,a.theta)):a.theta=a.theta>(et+tt)/2?Math.max(et,a.theta):Math.min(tt,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&b||n.object.isOrthographicCamera?a.radius=$(a.radius):a.radius=$(a.radius*c),I.setFromSpherical(a),I.applyQuaternion(Se),Ie.copy(n.target).add(I),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),h.set(0,0,0));let xt=!1;if(n.zoomToCursor&&b){let St=null;if(n.object.isPerspectiveCamera){const it=I.length();St=$(it*c);const At=it-St;n.object.position.addScaledVector(M,At),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const it=new C(y.x,y.y,0);it.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),xt=!0;const At=new C(y.x,y.y,0);At.unproject(n.object),n.object.position.sub(At).add(it),n.object.updateMatrixWorld(),St=I.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;St!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(St).add(n.object.position):(Lr.origin.copy(n.object.position),Lr.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Lr.direction))<dv?e.lookAt(n.target):(Yc.setFromNormalAndCoplanarPoint(n.object.up,n.target),Lr.intersectPlane(Yc,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),xt=!0);return c=1,b=!1,xt||_e.distanceToSquared(n.object.position)>o||8*(1-ie.dot(n.object.quaternion))>o||N.distanceToSquared(n.target)>0?(n.dispatchEvent(Wc),_e.copy(n.object.position),ie.copy(n.object.quaternion),N.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",rt),n.domElement.removeEventListener("pointerdown",R),n.domElement.removeEventListener("pointercancel",k),n.domElement.removeEventListener("wheel",oe),n.domElement.removeEventListener("pointermove",T),n.domElement.removeEventListener("pointerup",k),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",De),n._domElementKeyEvents=null)};const n=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const o=1e-6,a=new Vc,l=new Vc;let c=1;const h=new C,u=new Le,d=new Le,p=new Le,g=new Le,_=new Le,m=new Le,f=new Le,x=new Le,v=new Le,M=new C,y=new Le;let b=!1;const w=[],U={};let S=!1;function E(I){return I!==null?2*Math.PI/60*n.autoRotateSpeed*I:2*Math.PI/60/60*n.autoRotateSpeed}function L(I){const ae=Math.abs(I*.01);return Math.pow(.95,n.zoomSpeed*ae)}function F(I){l.theta-=I}function z(I){l.phi-=I}const D=function(){const I=new C;return function(Se,_e){I.setFromMatrixColumn(_e,0),I.multiplyScalar(-Se),h.add(I)}}(),O=function(){const I=new C;return function(Se,_e){n.screenSpacePanning===!0?I.setFromMatrixColumn(_e,1):(I.setFromMatrixColumn(_e,0),I.crossVectors(n.object.up,I)),I.multiplyScalar(Se),h.add(I)}}(),H=function(){const I=new C;return function(Se,_e){const ie=n.domElement;if(n.object.isPerspectiveCamera){const N=n.object.position;I.copy(N).sub(n.target);let le=I.length();le*=Math.tan(n.object.fov/2*Math.PI/180),D(2*Se*le/ie.clientHeight,n.object.matrix),O(2*_e*le/ie.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(D(Se*(n.object.right-n.object.left)/n.object.zoom/ie.clientWidth,n.object.matrix),O(_e*(n.object.top-n.object.bottom)/n.object.zoom/ie.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function q(I){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=I:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function K(I){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=I:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function j(I,ae){if(!n.zoomToCursor)return;b=!0;const Se=n.domElement.getBoundingClientRect(),_e=I-Se.left,ie=ae-Se.top,N=Se.width,le=Se.height;y.x=_e/N*2-1,y.y=-(ie/le)*2+1,M.set(y.x,y.y,1).unproject(n.object).sub(n.object.position).normalize()}function $(I){return Math.max(n.minDistance,Math.min(n.maxDistance,I))}function te(I){u.set(I.clientX,I.clientY)}function se(I){j(I.clientX,I.clientX),f.set(I.clientX,I.clientY)}function V(I){g.set(I.clientX,I.clientY)}function Q(I){d.set(I.clientX,I.clientY),p.subVectors(d,u).multiplyScalar(n.rotateSpeed);const ae=n.domElement;F(2*Math.PI*p.x/ae.clientHeight),z(2*Math.PI*p.y/ae.clientHeight),u.copy(d),n.update()}function he(I){x.set(I.clientX,I.clientY),v.subVectors(x,f),v.y>0?q(L(v.y)):v.y<0&&K(L(v.y)),f.copy(x),n.update()}function ve(I){_.set(I.clientX,I.clientY),m.subVectors(_,g).multiplyScalar(n.panSpeed),H(m.x,m.y),g.copy(_),n.update()}function ge(I){j(I.clientX,I.clientY),I.deltaY<0?K(L(I.deltaY)):I.deltaY>0&&q(L(I.deltaY)),n.update()}function Ae(I){let ae=!1;switch(I.code){case n.keys.UP:I.ctrlKey||I.metaKey||I.shiftKey?z(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(0,n.keyPanSpeed),ae=!0;break;case n.keys.BOTTOM:I.ctrlKey||I.metaKey||I.shiftKey?z(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(0,-n.keyPanSpeed),ae=!0;break;case n.keys.LEFT:I.ctrlKey||I.metaKey||I.shiftKey?F(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(n.keyPanSpeed,0),ae=!0;break;case n.keys.RIGHT:I.ctrlKey||I.metaKey||I.shiftKey?F(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(-n.keyPanSpeed,0),ae=!0;break}ae&&(I.preventDefault(),n.update())}function Fe(I){if(w.length===1)u.set(I.pageX,I.pageY);else{const ae=pe(I),Se=.5*(I.pageX+ae.x),_e=.5*(I.pageY+ae.y);u.set(Se,_e)}}function Pe(I){if(w.length===1)g.set(I.pageX,I.pageY);else{const ae=pe(I),Se=.5*(I.pageX+ae.x),_e=.5*(I.pageY+ae.y);g.set(Se,_e)}}function Ye(I){const ae=pe(I),Se=I.pageX-ae.x,_e=I.pageY-ae.y,ie=Math.sqrt(Se*Se+_e*_e);f.set(0,ie)}function G(I){n.enableZoom&&Ye(I),n.enablePan&&Pe(I)}function Rt(I){n.enableZoom&&Ye(I),n.enableRotate&&Fe(I)}function be(I){if(w.length==1)d.set(I.pageX,I.pageY);else{const Se=pe(I),_e=.5*(I.pageX+Se.x),ie=.5*(I.pageY+Se.y);d.set(_e,ie)}p.subVectors(d,u).multiplyScalar(n.rotateSpeed);const ae=n.domElement;F(2*Math.PI*p.x/ae.clientHeight),z(2*Math.PI*p.y/ae.clientHeight),u.copy(d)}function Ue(I){if(w.length===1)_.set(I.pageX,I.pageY);else{const ae=pe(I),Se=.5*(I.pageX+ae.x),_e=.5*(I.pageY+ae.y);_.set(Se,_e)}m.subVectors(_,g).multiplyScalar(n.panSpeed),H(m.x,m.y),g.copy(_)}function Me(I){const ae=pe(I),Se=I.pageX-ae.x,_e=I.pageY-ae.y,ie=Math.sqrt(Se*Se+_e*_e);x.set(0,ie),v.set(0,Math.pow(x.y/f.y,n.zoomSpeed)),q(v.y),f.copy(x);const N=(I.pageX+ae.x)*.5,le=(I.pageY+ae.y)*.5;j(N,le)}function at(I){n.enableZoom&&Me(I),n.enablePan&&Ue(I)}function ke(I){n.enableZoom&&Me(I),n.enableRotate&&be(I)}function R(I){n.enabled!==!1&&(w.length===0&&(n.domElement.setPointerCapture(I.pointerId),n.domElement.addEventListener("pointermove",T),n.domElement.addEventListener("pointerup",k)),je(I),I.pointerType==="touch"?We(I):re(I))}function T(I){n.enabled!==!1&&(I.pointerType==="touch"?ee(I):ne(I))}function k(I){Be(I),w.length===0&&(n.domElement.releasePointerCapture(I.pointerId),n.domElement.removeEventListener("pointermove",T),n.domElement.removeEventListener("pointerup",k)),n.dispatchEvent(Xc),r=i.NONE}function re(I){let ae;switch(I.button){case 0:ae=n.mouseButtons.LEFT;break;case 1:ae=n.mouseButtons.MIDDLE;break;case 2:ae=n.mouseButtons.RIGHT;break;default:ae=-1}switch(ae){case Jt.DOLLY:if(n.enableZoom===!1)return;se(I),r=i.DOLLY;break;case Jt.ROTATE:if(I.ctrlKey||I.metaKey||I.shiftKey){if(n.enablePan===!1)return;V(I),r=i.PAN}else{if(n.enableRotate===!1)return;te(I),r=i.ROTATE}break;case Jt.PAN:if(I.ctrlKey||I.metaKey||I.shiftKey){if(n.enableRotate===!1)return;te(I),r=i.ROTATE}else{if(n.enablePan===!1)return;V(I),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(Xo)}function ne(I){switch(r){case i.ROTATE:if(n.enableRotate===!1)return;Q(I);break;case i.DOLLY:if(n.enableZoom===!1)return;he(I);break;case i.PAN:if(n.enablePan===!1)return;ve(I);break}}function oe(I){n.enabled===!1||n.enableZoom===!1||r!==i.NONE||(I.preventDefault(),n.dispatchEvent(Xo),ge(ye(I)),n.dispatchEvent(Xc))}function ye(I){const ae=I.deltaMode,Se={clientX:I.clientX,clientY:I.clientY,deltaY:I.deltaY};switch(ae){case 1:Se.deltaY*=16;break;case 2:Se.deltaY*=100;break}return I.ctrlKey&&!S&&(Se.deltaY*=10),Se}function fe(I){I.key==="Control"&&(S=!0,document.addEventListener("keyup",xe,{passive:!0,capture:!0}))}function xe(I){I.key==="Control"&&(S=!1,document.removeEventListener("keyup",xe,{passive:!0,capture:!0}))}function De(I){n.enabled===!1||n.enablePan===!1||Ae(I)}function We(I){switch(we(I),w.length){case 1:switch(n.touches.ONE){case Fi.ROTATE:if(n.enableRotate===!1)return;Fe(I),r=i.TOUCH_ROTATE;break;case Fi.PAN:if(n.enablePan===!1)return;Pe(I),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(n.touches.TWO){case Fi.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;G(I),r=i.TOUCH_DOLLY_PAN;break;case Fi.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Rt(I),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(Xo)}function ee(I){switch(we(I),r){case i.TOUCH_ROTATE:if(n.enableRotate===!1)return;be(I),n.update();break;case i.TOUCH_PAN:if(n.enablePan===!1)return;Ue(I),n.update();break;case i.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;at(I),n.update();break;case i.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;ke(I),n.update();break;default:r=i.NONE}}function rt(I){n.enabled!==!1&&I.preventDefault()}function je(I){w.push(I.pointerId)}function Be(I){delete U[I.pointerId];for(let ae=0;ae<w.length;ae++)if(w[ae]==I.pointerId){w.splice(ae,1);return}}function we(I){let ae=U[I.pointerId];ae===void 0&&(ae=new Le,U[I.pointerId]=ae),ae.set(I.pageX,I.pageY)}function pe(I){const ae=I.pointerId===w[0]?w[1]:w[0];return U[ae]}n.domElement.addEventListener("contextmenu",rt),n.domElement.addEventListener("pointerdown",R),n.domElement.addEventListener("pointercancel",k),n.domElement.addEventListener("wheel",oe,{passive:!1}),document.addEventListener("keydown",fe,{passive:!0,capture:!0}),this.update()}}const di=new Zs,kt=new C,Xn=new C,gt=new ut,qc={X:new C(1,0,0),Y:new C(0,1,0),Z:new C(0,0,1)},Yo={type:"change"},jc={type:"mouseDown"},Zc={type:"mouseUp",mode:null},Kc={type:"objectChange"};class pv extends dt{constructor(e,t){super(),t===void 0&&(console.warn('THREE.TransformControls: The second parameter "domElement" is now mandatory.'),t=document),this.isTransformControls=!0,this.visible=!1,this.domElement=t,this.domElement.style.touchAction="none";const n=new Mv;this._gizmo=n,this.add(n);const i=new yv;this._plane=i,this.add(i);const r=this;function o(x,v){let M=v;Object.defineProperty(r,x,{get:function(){return M!==void 0?M:v},set:function(y){M!==y&&(M=y,i[x]=y,n[x]=y,r.dispatchEvent({type:x+"-changed",value:y}),r.dispatchEvent(Yo))}}),r[x]=v,i[x]=v,n[x]=v}o("camera",e),o("object",void 0),o("enabled",!0),o("axis",null),o("mode","translate"),o("translationSnap",null),o("rotationSnap",null),o("scaleSnap",null),o("space","world"),o("size",1),o("dragging",!1),o("showX",!0),o("showY",!0),o("showZ",!0);const a=new C,l=new C,c=new ut,h=new ut,u=new C,d=new ut,p=new C,g=new C,_=new C,m=0,f=new C;o("worldPosition",a),o("worldPositionStart",l),o("worldQuaternion",c),o("worldQuaternionStart",h),o("cameraPosition",u),o("cameraQuaternion",d),o("pointStart",p),o("pointEnd",g),o("rotationAxis",_),o("rotationAngle",m),o("eye",f),this._offset=new C,this._startNorm=new C,this._endNorm=new C,this._cameraScale=new C,this._parentPosition=new C,this._parentQuaternion=new ut,this._parentQuaternionInv=new ut,this._parentScale=new C,this._worldScaleStart=new C,this._worldQuaternionInv=new ut,this._worldScale=new C,this._positionStart=new C,this._quaternionStart=new ut,this._scaleStart=new C,this._getPointer=mv.bind(this),this._onPointerDown=_v.bind(this),this._onPointerHover=gv.bind(this),this._onPointerMove=vv.bind(this),this._onPointerUp=xv.bind(this),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp)}updateMatrixWorld(){this.object!==void 0&&(this.object.updateMatrixWorld(),this.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):this.object.parent.matrixWorld.decompose(this._parentPosition,this._parentQuaternion,this._parentScale),this.object.matrixWorld.decompose(this.worldPosition,this.worldQuaternion,this._worldScale),this._parentQuaternionInv.copy(this._parentQuaternion).invert(),this._worldQuaternionInv.copy(this.worldQuaternion).invert()),this.camera.updateMatrixWorld(),this.camera.matrixWorld.decompose(this.cameraPosition,this.cameraQuaternion,this._cameraScale),this.camera.isOrthographicCamera?this.camera.getWorldDirection(this.eye).negate():this.eye.copy(this.cameraPosition).sub(this.worldPosition).normalize(),super.updateMatrixWorld(this)}pointerHover(e){if(this.object===void 0||this.dragging===!0)return;di.setFromCamera(e,this.camera);const t=qo(this._gizmo.picker[this.mode],di);t?this.axis=t.object.name:this.axis=null}pointerDown(e){if(!(this.object===void 0||this.dragging===!0||e.button!==0)&&this.axis!==null){di.setFromCamera(e,this.camera);const t=qo(this._plane,di,!0);t&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(t.point).sub(this.worldPositionStart)),this.dragging=!0,jc.mode=this.mode,this.dispatchEvent(jc)}}pointerMove(e){const t=this.axis,n=this.mode,i=this.object;let r=this.space;if(n==="scale"?r="local":(t==="E"||t==="XYZE"||t==="XYZ")&&(r="world"),i===void 0||t===null||this.dragging===!1||e.button!==-1)return;di.setFromCamera(e,this.camera);const o=qo(this._plane,di,!0);if(o){if(this.pointEnd.copy(o.point).sub(this.worldPositionStart),n==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),r==="local"&&t!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),t.indexOf("X")===-1&&(this._offset.x=0),t.indexOf("Y")===-1&&(this._offset.y=0),t.indexOf("Z")===-1&&(this._offset.z=0),r==="local"&&t!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),i.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(r==="local"&&(i.position.applyQuaternion(gt.copy(this._quaternionStart).invert()),t.search("X")!==-1&&(i.position.x=Math.round(i.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(i.position.y=Math.round(i.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(i.position.z=Math.round(i.position.z/this.translationSnap)*this.translationSnap),i.position.applyQuaternion(this._quaternionStart)),r==="world"&&(i.parent&&i.position.add(kt.setFromMatrixPosition(i.parent.matrixWorld)),t.search("X")!==-1&&(i.position.x=Math.round(i.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(i.position.y=Math.round(i.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(i.position.z=Math.round(i.position.z/this.translationSnap)*this.translationSnap),i.parent&&i.position.sub(kt.setFromMatrixPosition(i.parent.matrixWorld))));else if(n==="scale"){if(t.search("XYZ")!==-1){let a=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(a*=-1),Xn.set(a,a,a)}else kt.copy(this.pointStart),Xn.copy(this.pointEnd),kt.applyQuaternion(this._worldQuaternionInv),Xn.applyQuaternion(this._worldQuaternionInv),Xn.divide(kt),t.search("X")===-1&&(Xn.x=1),t.search("Y")===-1&&(Xn.y=1),t.search("Z")===-1&&(Xn.z=1);i.scale.copy(this._scaleStart).multiply(Xn),this.scaleSnap&&(t.search("X")!==-1&&(i.scale.x=Math.round(i.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Y")!==-1&&(i.scale.y=Math.round(i.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Z")!==-1&&(i.scale.z=Math.round(i.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(n==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);const a=20/this.worldPosition.distanceTo(kt.setFromMatrixPosition(this.camera.matrixWorld));let l=!1;t==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(kt.copy(this.rotationAxis).cross(this.eye))*a):(t==="X"||t==="Y"||t==="Z")&&(this.rotationAxis.copy(qc[t]),kt.copy(qc[t]),r==="local"&&kt.applyQuaternion(this.worldQuaternion),kt.cross(this.eye),kt.length()===0?l=!0:this.rotationAngle=this._offset.dot(kt.normalize())*a),(t==="E"||l)&&(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),r==="local"&&t!=="E"&&t!=="XYZE"?(i.quaternion.copy(this._quaternionStart),i.quaternion.multiply(gt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),i.quaternion.copy(gt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),i.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(Yo),this.dispatchEvent(Kc)}}pointerUp(e){e.button===0&&(this.dragging&&this.axis!==null&&(Zc.mode=this.mode,this.dispatchEvent(Zc)),this.dragging=!1,this.axis=null)}dispose(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.traverse(function(e){e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})}attach(e){return this.object=e,this.visible=!0,this}detach(){return this.object=void 0,this.visible=!1,this.axis=null,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(Yo),this.dispatchEvent(Kc),this.pointStart.copy(this.pointEnd))}getRaycaster(){return di}getMode(){return this.mode}setMode(e){this.mode=e}setTranslationSnap(e){this.translationSnap=e}setRotationSnap(e){this.rotationSnap=e}setScaleSnap(e){this.scaleSnap=e}setSize(e){this.size=e}setSpace(e){this.space=e}}function mv(s){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:s.button};{const e=this.domElement.getBoundingClientRect();return{x:(s.clientX-e.left)/e.width*2-1,y:-(s.clientY-e.top)/e.height*2+1,button:s.button}}}function gv(s){if(this.enabled)switch(s.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(s));break}}function _v(s){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(s.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(s)),this.pointerDown(this._getPointer(s)))}function vv(s){this.enabled&&this.pointerMove(this._getPointer(s))}function xv(s){this.enabled&&(this.domElement.releasePointerCapture(s.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(s)))}function qo(s,e,t){const n=e.intersectObject(s,!0);for(let i=0;i<n.length;i++)if(n[i].object.visible||t)return n[i];return!1}const Ir=new Yt,ct=new C(0,1,0),$c=new C(0,0,0),Qc=new Te,Dr=new ut,Or=new ut,En=new C,Jc=new Te,Ls=new C(1,0,0),pi=new C(0,1,0),Is=new C(0,0,1),Ur=new C,Ps=new C,Rs=new C;class Mv extends dt{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";const e=new Fn({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),t=new jn({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),n=e.clone();n.opacity=.15;const i=t.clone();i.opacity=.5;const r=e.clone();r.color.setHex(16711680);const o=e.clone();o.color.setHex(65280);const a=e.clone();a.color.setHex(255);const l=e.clone();l.color.setHex(16711680),l.opacity=.5;const c=e.clone();c.color.setHex(65280),c.opacity=.5;const h=e.clone();h.color.setHex(255),h.opacity=.5;const u=e.clone();u.opacity=.25;const d=e.clone();d.color.setHex(16776960),d.opacity=.25,e.clone().color.setHex(16776960);const g=e.clone();g.color.setHex(7895160);const _=new bt(0,.04,.1,12);_.translate(0,.05,0);const m=new ht(.08,.08,.08);m.translate(0,.04,0);const f=new yt;f.setAttribute("position",new nt([0,0,0,1,0,0],3));const x=new bt(.0075,.0075,.5,3);x.translate(0,.25,0);function v(O,H){const q=new _i(O,.0075,3,64,H*Math.PI*2);return q.rotateY(Math.PI/2),q.rotateX(Math.PI/2),q}function M(){const O=new yt;return O.setAttribute("position",new nt([0,0,0,1,1,1],3)),O}const y={X:[[new ce(_,r),[.5,0,0],[0,0,-Math.PI/2]],[new ce(_,r),[-.5,0,0],[0,0,Math.PI/2]],[new ce(x,r),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new ce(_,o),[0,.5,0]],[new ce(_,o),[0,-.5,0],[Math.PI,0,0]],[new ce(x,o)]],Z:[[new ce(_,a),[0,0,.5],[Math.PI/2,0,0]],[new ce(_,a),[0,0,-.5],[-Math.PI/2,0,0]],[new ce(x,a),null,[Math.PI/2,0,0]]],XYZ:[[new ce(new as(.1,0),u.clone()),[0,0,0]]],XY:[[new ce(new ht(.15,.15,.01),h.clone()),[.15,.15,0]]],YZ:[[new ce(new ht(.15,.15,.01),l.clone()),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ce(new ht(.15,.15,.01),c.clone()),[.15,0,.15],[-Math.PI/2,0,0]]]},b={X:[[new ce(new bt(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new ce(new bt(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new ce(new bt(.2,0,.6,4),n),[0,.3,0]],[new ce(new bt(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new ce(new bt(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new ce(new bt(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new ce(new as(.2,0),n)]],XY:[[new ce(new ht(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new ce(new ht(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ce(new ht(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]]},w={START:[[new ce(new as(.01,2),i),null,null,null,"helper"]],END:[[new ce(new as(.01,2),i),null,null,null,"helper"]],DELTA:[[new _n(M(),i),null,null,null,"helper"]],X:[[new _n(f,i.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new _n(f,i.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new _n(f,i.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},U={XYZE:[[new ce(v(.5,1),g),null,[0,Math.PI/2,0]]],X:[[new ce(v(.5,.5),r)]],Y:[[new ce(v(.5,.5),o),null,[0,0,-Math.PI/2]]],Z:[[new ce(v(.5,.5),a),null,[0,Math.PI/2,0]]],E:[[new ce(v(.75,1),d),null,[0,Math.PI/2,0]]]},S={AXIS:[[new _n(f,i.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]]},E={XYZE:[[new ce(new Ai(.25,10,8),n)]],X:[[new ce(new _i(.5,.1,4,24),n),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new ce(new _i(.5,.1,4,24),n),[0,0,0],[Math.PI/2,0,0]]],Z:[[new ce(new _i(.5,.1,4,24),n),[0,0,0],[0,0,-Math.PI/2]]],E:[[new ce(new _i(.75,.1,2,24),n)]]},L={X:[[new ce(m,r),[.5,0,0],[0,0,-Math.PI/2]],[new ce(x,r),[0,0,0],[0,0,-Math.PI/2]],[new ce(m,r),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new ce(m,o),[0,.5,0]],[new ce(x,o)],[new ce(m,o),[0,-.5,0],[0,0,Math.PI]]],Z:[[new ce(m,a),[0,0,.5],[Math.PI/2,0,0]],[new ce(x,a),[0,0,0],[Math.PI/2,0,0]],[new ce(m,a),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new ce(new ht(.15,.15,.01),h),[.15,.15,0]]],YZ:[[new ce(new ht(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ce(new ht(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new ce(new ht(.1,.1,.1),u.clone())]]},F={X:[[new ce(new bt(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new ce(new bt(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new ce(new bt(.2,0,.6,4),n),[0,.3,0]],[new ce(new bt(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new ce(new bt(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new ce(new bt(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new ce(new ht(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new ce(new ht(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ce(new ht(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new ce(new ht(.2,.2,.2),n),[0,0,0]]]},z={X:[[new _n(f,i.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new _n(f,i.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new _n(f,i.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function D(O){const H=new dt;for(const q in O)for(let K=O[q].length;K--;){const j=O[q][K][0].clone(),$=O[q][K][1],te=O[q][K][2],se=O[q][K][3],V=O[q][K][4];j.name=q,j.tag=V,$&&j.position.set($[0],$[1],$[2]),te&&j.rotation.set(te[0],te[1],te[2]),se&&j.scale.set(se[0],se[1],se[2]),j.updateMatrix();const Q=j.geometry.clone();Q.applyMatrix4(j.matrix),j.geometry=Q,j.renderOrder=1/0,j.position.set(0,0,0),j.rotation.set(0,0,0),j.scale.set(1,1,1),H.add(j)}return H}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=D(y)),this.add(this.gizmo.rotate=D(U)),this.add(this.gizmo.scale=D(L)),this.add(this.picker.translate=D(b)),this.add(this.picker.rotate=D(E)),this.add(this.picker.scale=D(F)),this.add(this.helper.translate=D(w)),this.add(this.helper.rotate=D(S)),this.add(this.helper.scale=D(z)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(e){const n=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:Or;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let i=[];i=i.concat(this.picker[this.mode].children),i=i.concat(this.gizmo[this.mode].children),i=i.concat(this.helper[this.mode].children);for(let r=0;r<i.length;r++){const o=i[r];o.visible=!0,o.rotation.set(0,0,0),o.position.copy(this.worldPosition);let a;if(this.camera.isOrthographicCamera?a=(this.camera.top-this.camera.bottom)/this.camera.zoom:a=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),o.scale.set(1,1,1).multiplyScalar(a*this.size/4),o.tag==="helper"){o.visible=!1,o.name==="AXIS"?(o.visible=!!this.axis,this.axis==="X"&&(gt.setFromEuler(Ir.set(0,0,0)),o.quaternion.copy(n).multiply(gt),Math.abs(ct.copy(Ls).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Y"&&(gt.setFromEuler(Ir.set(0,0,Math.PI/2)),o.quaternion.copy(n).multiply(gt),Math.abs(ct.copy(pi).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Z"&&(gt.setFromEuler(Ir.set(0,Math.PI/2,0)),o.quaternion.copy(n).multiply(gt),Math.abs(ct.copy(Is).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="XYZE"&&(gt.setFromEuler(Ir.set(0,Math.PI/2,0)),ct.copy(this.rotationAxis),o.quaternion.setFromRotationMatrix(Qc.lookAt($c,ct,pi)),o.quaternion.multiply(gt),o.visible=this.dragging),this.axis==="E"&&(o.visible=!1)):o.name==="START"?(o.position.copy(this.worldPositionStart),o.visible=this.dragging):o.name==="END"?(o.position.copy(this.worldPosition),o.visible=this.dragging):o.name==="DELTA"?(o.position.copy(this.worldPositionStart),o.quaternion.copy(this.worldQuaternionStart),kt.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),kt.applyQuaternion(this.worldQuaternionStart.clone().invert()),o.scale.copy(kt),o.visible=this.dragging):(o.quaternion.copy(n),this.dragging?o.position.copy(this.worldPositionStart):o.position.copy(this.worldPosition),this.axis&&(o.visible=this.axis.search(o.name)!==-1));continue}o.quaternion.copy(n),this.mode==="translate"||this.mode==="scale"?(o.name==="X"&&Math.abs(ct.copy(Ls).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Y"&&Math.abs(ct.copy(pi).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Z"&&Math.abs(ct.copy(Is).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XY"&&Math.abs(ct.copy(Is).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="YZ"&&Math.abs(ct.copy(Ls).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XZ"&&Math.abs(ct.copy(pi).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1)):this.mode==="rotate"&&(Dr.copy(n),ct.copy(this.eye).applyQuaternion(gt.copy(n).invert()),o.name.search("E")!==-1&&o.quaternion.setFromRotationMatrix(Qc.lookAt(this.eye,$c,pi)),o.name==="X"&&(gt.setFromAxisAngle(Ls,Math.atan2(-ct.y,ct.z)),gt.multiplyQuaternions(Dr,gt),o.quaternion.copy(gt)),o.name==="Y"&&(gt.setFromAxisAngle(pi,Math.atan2(ct.x,ct.z)),gt.multiplyQuaternions(Dr,gt),o.quaternion.copy(gt)),o.name==="Z"&&(gt.setFromAxisAngle(Is,Math.atan2(ct.y,ct.x)),gt.multiplyQuaternions(Dr,gt),o.quaternion.copy(gt))),o.visible=o.visible&&(o.name.indexOf("X")===-1||this.showX),o.visible=o.visible&&(o.name.indexOf("Y")===-1||this.showY),o.visible=o.visible&&(o.name.indexOf("Z")===-1||this.showZ),o.visible=o.visible&&(o.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),o.material._color=o.material._color||o.material.color.clone(),o.material._opacity=o.material._opacity||o.material.opacity,o.material.color.copy(o.material._color),o.material.opacity=o.material._opacity,this.enabled&&this.axis&&(o.name===this.axis||this.axis.split("").some(function(l){return o.name===l}))&&(o.material.color.setHex(16776960),o.material.opacity=1)}super.updateMatrixWorld(e)}}class yv extends ce{constructor(){super(new Kn(1e5,1e5,2,2),new Fn({visible:!1,wireframe:!0,side:en,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(e){let t=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(t="local"),Ur.copy(Ls).applyQuaternion(t==="local"?this.worldQuaternion:Or),Ps.copy(pi).applyQuaternion(t==="local"?this.worldQuaternion:Or),Rs.copy(Is).applyQuaternion(t==="local"?this.worldQuaternion:Or),ct.copy(Ps),this.mode){case"translate":case"scale":switch(this.axis){case"X":ct.copy(this.eye).cross(Ur),En.copy(Ur).cross(ct);break;case"Y":ct.copy(this.eye).cross(Ps),En.copy(Ps).cross(ct);break;case"Z":ct.copy(this.eye).cross(Rs),En.copy(Rs).cross(ct);break;case"XY":En.copy(Rs);break;case"YZ":En.copy(Ur);break;case"XZ":ct.copy(Rs),En.copy(Ps);break;case"XYZ":case"E":En.set(0,0,0);break}break;case"rotate":default:En.set(0,0,0)}En.length()===0?this.quaternion.copy(this.cameraQuaternion):(Jc.lookAt(kt.set(0,0,0),En,ct),this.quaternion.setFromRotationMatrix(Jc)),super.updateMatrixWorld(e)}}const du={tavern:{id:"tavern",width:2,height:1,name:"Tavern",color:14251782},shipwright:{id:"shipwright",width:2,height:1,name:"Shipwright",color:6583435},market:{id:"market",width:2,height:1,name:"Market",color:1483594},lighthouse:{id:"lighthouse",width:1,height:1,name:"Lighthouse",color:16498468},warehouse:{id:"warehouse",width:2,height:2,name:"Warehouse",color:7893356},fort:{id:"fort",width:3,height:2,name:"Fort",color:7041664},docks:{id:"docks",width:3,height:1,name:"Docks",color:959977,allowOverWater:!0},dragon_sanctuary:{id:"dragon_sanctuary",width:3,height:3,name:"Dragon Sanctuary",color:8141549},castle:{id:"castle",width:3,height:3,name:"Castle",color:3621201,description:"Store cargo, gold/pieces-of-eight for crew wages, receive tax from buildings and player trading"},blacksmith:{id:"blacksmith",width:2,height:1,name:"Blacksmith",color:11817737,description:"Craft and sell cannons, cannonballs, and swords"}};function sn(s){return du[s]??null}function jo(s){const e=sn(s);return!!(e&&e.allowOverWater)}let ns={};function fu(s,e,t){e!=null||t!=null?(ns[s]=ns[s]||{},e!=null&&(ns[s].width=Math.max(1,Math.min(5,e))),t!=null&&(ns[s].height=Math.max(1,Math.min(5,t)))):delete ns[s]}function $n(s){const e=sn(s),t=e?{width:e.width,height:e.height}:{width:1,height:1},n=ns[s];return n?{width:n.width??t.width,height:n.height??t.height}:t}function yn(s){return s&&s.width!=null&&s.height!=null?{width:s.width,height:s.height}:$n((s==null?void 0:s.type)??"")}const pu={berry_bush_01:{id:"berry_bush_01",name:"Berry Bush",color:2278750,fbxPath:"/props/BerryBush_01/BerryBush_01.fbx",placeholderShape:"sphere"},oak_tree_01:{id:"oak_tree_01",name:"Oak Tree",color:1409085,fbxPath:"/props/OakTree_01/OakTree_01.fbx",placeholderShape:"cone",defaultScale:8},palm_tree_01:{id:"palm_tree_01",name:"Palm Tree 1",color:1483594,fbxPath:"/props/PalmTree_01/PalmTree_01.fbx",placeholderShape:"cylinder",defaultScale:8},palm_tree_02:{id:"palm_tree_02",name:"Palm Tree 2",color:1409085,fbxPath:"/props/PalmTree_02/PalmTree_02.fbx",placeholderShape:"cylinder",defaultScale:8},rock_01:{id:"rock_01",name:"Rock",color:7041664,fbxPath:"/props/Rock_01/Rock_01.fbx",placeholderShape:"sphere"},rock_06:{id:"rock_06",name:"Brimstone Rock",color:8330525,fbxPath:"/props/Rock_06/Rock_06.fbx",placeholderShape:"sphere"},sign:{id:"sign",name:"Sign",color:7893356,placeholderShape:"signpost"}};function Bn(s){return pu[s]??null}/*!
fflate - fast JavaScript compression/decompression
<https://101arrowz.github.io/fflate>
Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
version 0.6.9
*/var eh=function(s){return URL.createObjectURL(new Blob([s],{type:"text/javascript"}))};try{URL.revokeObjectURL(eh(""))}catch{eh=function(e){return"data:application/javascript;charset=UTF-8,"+encodeURI(e)}}var dn=Uint8Array,Qn=Uint16Array,pa=Uint32Array,mu=new dn([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),gu=new dn([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Sv=new dn([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),_u=function(s,e){for(var t=new Qn(31),n=0;n<31;++n)t[n]=e+=1<<s[n-1];for(var i=new pa(t[30]),n=1;n<30;++n)for(var r=t[n];r<t[n+1];++r)i[r]=r-t[n]<<5|n;return[t,i]},vu=_u(mu,2),xu=vu[0],Ev=vu[1];xu[28]=258,Ev[258]=28;var bv=_u(gu,0),wv=bv[0],ma=new Qn(32768);for(var pt=0;pt<32768;++pt){var Yn=(pt&43690)>>>1|(pt&21845)<<1;Yn=(Yn&52428)>>>2|(Yn&13107)<<2,Yn=(Yn&61680)>>>4|(Yn&3855)<<4,ma[pt]=((Yn&65280)>>>8|(Yn&255)<<8)>>>1}var Ns=function(s,e,t){for(var n=s.length,i=0,r=new Qn(e);i<n;++i)++r[s[i]-1];var o=new Qn(e);for(i=0;i<e;++i)o[i]=o[i-1]+r[i-1]<<1;var a;if(t){a=new Qn(1<<e);var l=15-e;for(i=0;i<n;++i)if(s[i])for(var c=i<<4|s[i],h=e-s[i],u=o[s[i]-1]++<<h,d=u|(1<<h)-1;u<=d;++u)a[ma[u]>>>l]=c}else for(a=new Qn(n),i=0;i<n;++i)s[i]&&(a[i]=ma[o[s[i]-1]++]>>>15-s[i]);return a},Ks=new dn(288);for(var pt=0;pt<144;++pt)Ks[pt]=8;for(var pt=144;pt<256;++pt)Ks[pt]=9;for(var pt=256;pt<280;++pt)Ks[pt]=7;for(var pt=280;pt<288;++pt)Ks[pt]=8;var Mu=new dn(32);for(var pt=0;pt<32;++pt)Mu[pt]=5;var Tv=Ns(Ks,9,1),Av=Ns(Mu,5,1),Zo=function(s){for(var e=s[0],t=1;t<s.length;++t)s[t]>e&&(e=s[t]);return e},gn=function(s,e,t){var n=e/8|0;return(s[n]|s[n+1]<<8)>>(e&7)&t},Ko=function(s,e){var t=e/8|0;return(s[t]|s[t+1]<<8|s[t+2]<<16)>>(e&7)},Pv=function(s){return(s/8|0)+(s&7&&1)},Rv=function(s,e,t){(t==null||t>s.length)&&(t=s.length);var n=new(s instanceof Qn?Qn:s instanceof pa?pa:dn)(t-e);return n.set(s.subarray(e,t)),n},Cv=function(s,e,t){var n=s.length;if(!n||t&&!t.l&&n<5)return e||new dn(0);var i=!e||t,r=!t||t.i;t||(t={}),e||(e=new dn(n*3));var o=function(ve){var ge=e.length;if(ve>ge){var Ae=new dn(Math.max(ge*2,ve));Ae.set(e),e=Ae}},a=t.f||0,l=t.p||0,c=t.b||0,h=t.l,u=t.d,d=t.m,p=t.n,g=n*8;do{if(!h){t.f=a=gn(s,l,1);var _=gn(s,l+1,3);if(l+=3,_)if(_==1)h=Tv,u=Av,d=9,p=5;else if(_==2){var v=gn(s,l,31)+257,M=gn(s,l+10,15)+4,y=v+gn(s,l+5,31)+1;l+=14;for(var b=new dn(y),w=new dn(19),U=0;U<M;++U)w[Sv[U]]=gn(s,l+U*3,7);l+=M*3;for(var S=Zo(w),E=(1<<S)-1,L=Ns(w,S,1),U=0;U<y;){var F=L[gn(s,l,E)];l+=F&15;var m=F>>>4;if(m<16)b[U++]=m;else{var z=0,D=0;for(m==16?(D=3+gn(s,l,3),l+=2,z=b[U-1]):m==17?(D=3+gn(s,l,7),l+=3):m==18&&(D=11+gn(s,l,127),l+=7);D--;)b[U++]=z}}var O=b.subarray(0,v),H=b.subarray(v);d=Zo(O),p=Zo(H),h=Ns(O,d,1),u=Ns(H,p,1)}else throw"invalid block type";else{var m=Pv(l)+4,f=s[m-4]|s[m-3]<<8,x=m+f;if(x>n){if(r)throw"unexpected EOF";break}i&&o(c+f),e.set(s.subarray(m,x),c),t.b=c+=f,t.p=l=x*8;continue}if(l>g){if(r)throw"unexpected EOF";break}}i&&o(c+131072);for(var q=(1<<d)-1,K=(1<<p)-1,j=l;;j=l){var z=h[Ko(s,l)&q],$=z>>>4;if(l+=z&15,l>g){if(r)throw"unexpected EOF";break}if(!z)throw"invalid length/literal";if($<256)e[c++]=$;else if($==256){j=l,h=null;break}else{var te=$-254;if($>264){var U=$-257,se=mu[U];te=gn(s,l,(1<<se)-1)+xu[U],l+=se}var V=u[Ko(s,l)&K],Q=V>>>4;if(!V)throw"invalid distance";l+=V&15;var H=wv[Q];if(Q>3){var se=gu[Q];H+=Ko(s,l)&(1<<se)-1,l+=se}if(l>g){if(r)throw"unexpected EOF";break}i&&o(c+131072);for(var he=c+te;c<he;c+=4)e[c]=e[c-H],e[c+1]=e[c+1-H],e[c+2]=e[c+2-H],e[c+3]=e[c+3-H];c=he}}t.l=h,t.p=j,t.b=c,h&&(a=1,t.m=d,t.d=u,t.n=p)}while(!a);return c==e.length?e:Rv(e,0,c)},Lv=new dn(0),Iv=function(s){if((s[0]&15)!=8||s[0]>>>4>7||(s[0]<<8|s[1])%31)throw"invalid zlib data";if(s[1]&32)throw"invalid zlib data: preset dictionaries not supported"};function Dv(s,e){return Cv((Iv(s),s.subarray(2,-4)),e)}var Uv=typeof TextDecoder<"u"&&new TextDecoder,Fv=0;try{Uv.decode(Lv,{stream:!0}),Fv=1}catch{}function yu(s,e,t){const n=t.length-s-1;if(e>=t[n])return n-1;if(e<=t[s])return s;let i=s,r=n,o=Math.floor((i+r)/2);for(;e<t[o]||e>=t[o+1];)e<t[o]?r=o:i=o,o=Math.floor((i+r)/2);return o}function Nv(s,e,t,n){const i=[],r=[],o=[];i[0]=1;for(let a=1;a<=t;++a){r[a]=e-n[s+1-a],o[a]=n[s+a]-e;let l=0;for(let c=0;c<a;++c){const h=o[c+1],u=r[a-c],d=i[c]/(h+u);i[c]=l+h*d,l=u*d}i[a]=l}return i}function Ov(s,e,t,n){const i=yu(s,n,e),r=Nv(i,n,s,e),o=new ot(0,0,0,0);for(let a=0;a<=s;++a){const l=t[i-s+a],c=r[a],h=l.w*c;o.x+=l.x*h,o.y+=l.y*h,o.z+=l.z*h,o.w+=l.w*c}return o}function Bv(s,e,t,n,i){const r=[];for(let u=0;u<=t;++u)r[u]=0;const o=[];for(let u=0;u<=n;++u)o[u]=r.slice(0);const a=[];for(let u=0;u<=t;++u)a[u]=r.slice(0);a[0][0]=1;const l=r.slice(0),c=r.slice(0);for(let u=1;u<=t;++u){l[u]=e-i[s+1-u],c[u]=i[s+u]-e;let d=0;for(let p=0;p<u;++p){const g=c[p+1],_=l[u-p];a[u][p]=g+_;const m=a[p][u-1]/a[u][p];a[p][u]=d+g*m,d=_*m}a[u][u]=d}for(let u=0;u<=t;++u)o[0][u]=a[u][t];for(let u=0;u<=t;++u){let d=0,p=1;const g=[];for(let _=0;_<=t;++_)g[_]=r.slice(0);g[0][0]=1;for(let _=1;_<=n;++_){let m=0;const f=u-_,x=t-_;u>=_&&(g[p][0]=g[d][0]/a[x+1][f],m=g[p][0]*a[f][x]);const v=f>=-1?1:-f,M=u-1<=x?_-1:t-u;for(let b=v;b<=M;++b)g[p][b]=(g[d][b]-g[d][b-1])/a[x+1][f+b],m+=g[p][b]*a[f+b][x];u<=x&&(g[p][_]=-g[d][_-1]/a[x+1][u],m+=g[p][_]*a[u][x]),o[_][u]=m;const y=d;d=p,p=y}}let h=t;for(let u=1;u<=n;++u){for(let d=0;d<=t;++d)o[u][d]*=h;h*=t-u}return o}function zv(s,e,t,n,i){const r=i<s?i:s,o=[],a=yu(s,n,e),l=Bv(a,n,s,r,e),c=[];for(let h=0;h<t.length;++h){const u=t[h].clone(),d=u.w;u.x*=d,u.y*=d,u.z*=d,c[h]=u}for(let h=0;h<=r;++h){const u=c[a-s].clone().multiplyScalar(l[h][0]);for(let d=1;d<=s;++d)u.add(c[a-s+d].clone().multiplyScalar(l[h][d]));o[h]=u}for(let h=r+1;h<=i+1;++h)o[h]=new ot(0,0,0);return o}function Hv(s,e){let t=1;for(let i=2;i<=s;++i)t*=i;let n=1;for(let i=2;i<=e;++i)n*=i;for(let i=2;i<=s-e;++i)n*=i;return t/n}function kv(s){const e=s.length,t=[],n=[];for(let r=0;r<e;++r){const o=s[r];t[r]=new C(o.x,o.y,o.z),n[r]=o.w}const i=[];for(let r=0;r<e;++r){const o=t[r].clone();for(let a=1;a<=r;++a)o.sub(i[r-a].clone().multiplyScalar(Hv(r,a)*n[a]));i[r]=o.divideScalar(n[0])}return i}function Gv(s,e,t,n,i){const r=zv(s,e,t,n,i);return kv(r)}class Vv extends x_{constructor(e,t,n,i,r){super(),this.degree=e,this.knots=t,this.controlPoints=[],this.startKnot=i||0,this.endKnot=r||this.knots.length-1;for(let o=0;o<n.length;++o){const a=n[o];this.controlPoints[o]=new ot(a.x,a.y,a.z,a.w)}}getPoint(e,t=new C){const n=t,i=this.knots[this.startKnot]+e*(this.knots[this.endKnot]-this.knots[this.startKnot]),r=Ov(this.degree,this.knots,this.controlPoints,i);return r.w!==1&&r.divideScalar(r.w),n.set(r.x,r.y,r.z)}getTangent(e,t=new C){const n=t,i=this.knots[0]+e*(this.knots[this.knots.length-1]-this.knots[0]),r=Gv(this.degree,this.knots,this.controlPoints,i,1);return n.copy(r[1]).normalize(),n}}let Ke,wt,Xt;class Wv extends Ri{constructor(e){super(e)}load(e,t,n,i){const r=this,o=r.path===""?nv.extractUrlBase(e):r.path,a=new Z_(this.manager);a.setPath(r.path),a.setResponseType("arraybuffer"),a.setRequestHeader(r.requestHeader),a.setWithCredentials(r.withCredentials),a.load(e,function(l){try{t(r.parse(l,o))}catch(c){i?i(c):console.error(c),r.manager.itemError(e)}},n,i)}parse(e,t){if(Kv(e))Ke=new Zv().parse(e);else{const i=wu(e);if(!$v(i))throw new Error("THREE.FBXLoader: Unknown format.");if(nh(i)<7e3)throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: "+nh(i));Ke=new jv().parse(i)}const n=new $_(this.manager).setPath(this.resourcePath||t).setCrossOrigin(this.crossOrigin);return new Xv(n,this.manager).parse(Ke)}}class Xv{constructor(e,t){this.textureLoader=e,this.manager=t}parse(){wt=this.parseConnections();const e=this.parseImages(),t=this.parseTextures(e),n=this.parseMaterials(t),i=this.parseDeformers(),r=new Yv().parse(i);return this.parseScene(i,r,n),Xt}parseConnections(){const e=new Map;return"Connections"in Ke&&Ke.Connections.connections.forEach(function(n){const i=n[0],r=n[1],o=n[2];e.has(i)||e.set(i,{parents:[],children:[]});const a={ID:r,relationship:o};e.get(i).parents.push(a),e.has(r)||e.set(r,{parents:[],children:[]});const l={ID:i,relationship:o};e.get(r).children.push(l)}),e}parseImages(){const e={},t={};if("Video"in Ke.Objects){const n=Ke.Objects.Video;for(const i in n){const r=n[i],o=parseInt(i);if(e[o]=r.RelativeFilename||r.Filename,"Content"in r){const a=r.Content instanceof ArrayBuffer&&r.Content.byteLength>0,l=typeof r.Content=="string"&&r.Content!=="";if(a||l){const c=this.parseImage(n[i]);t[r.RelativeFilename||r.Filename]=c}}}}for(const n in e){const i=e[n];t[i]!==void 0?e[n]=t[i]:e[n]=e[n].split("\\").pop()}return e}parseImage(e){const t=e.Content,n=e.RelativeFilename||e.Filename,i=n.slice(n.lastIndexOf(".")+1).toLowerCase();let r;switch(i){case"bmp":r="image/bmp";break;case"jpg":case"jpeg":r="image/jpeg";break;case"png":r="image/png";break;case"tif":r="image/tiff";break;case"tga":this.manager.getHandler(".tga")===null&&console.warn("FBXLoader: TGA loader not found, skipping ",n),r="image/tga";break;default:console.warn('FBXLoader: Image type "'+i+'" is not supported.');return}if(typeof t=="string")return"data:"+r+";base64,"+t;{const o=new Uint8Array(t);return window.URL.createObjectURL(new Blob([o],{type:r}))}}parseTextures(e){const t=new Map;if("Texture"in Ke.Objects){const n=Ke.Objects.Texture;for(const i in n){const r=this.parseTexture(n[i],e);t.set(parseInt(i),r)}}return t}parseTexture(e,t){const n=this.loadTexture(e,t);n.ID=e.id,n.name=e.attrName;const i=e.WrapModeU,r=e.WrapModeV,o=i!==void 0?i.value:0,a=r!==void 0?r.value:0;if(n.wrapS=o===0?Os:tn,n.wrapT=a===0?Os:tn,"Scaling"in e){const l=e.Scaling.value;n.repeat.x=l[0],n.repeat.y=l[1]}if("Translation"in e){const l=e.Translation.value;n.offset.x=l[0],n.offset.y=l[1]}return n}loadTexture(e,t){let n;const i=this.textureLoader.path,r=wt.get(e.id).children;r!==void 0&&r.length>0&&t[r[0].ID]!==void 0&&(n=t[r[0].ID],(n.indexOf("blob:")===0||n.indexOf("data:")===0)&&this.textureLoader.setPath(void 0));let o;const a=e.FileName.slice(-3).toLowerCase();if(a==="tga"){const l=this.manager.getHandler(".tga");l===null?(console.warn("FBXLoader: TGA loader not found, creating placeholder texture for",e.RelativeFilename),o=new Ft):(l.setPath(this.textureLoader.path),o=l.load(n))}else if(a==="dds"){const l=this.manager.getHandler(".dds");l===null?(console.warn("FBXLoader: DDS loader not found, creating placeholder texture for",e.RelativeFilename),o=new Ft):(l.setPath(this.textureLoader.path),o=l.load(n))}else a==="psd"?(console.warn("FBXLoader: PSD textures are not supported, creating placeholder texture for",e.RelativeFilename),o=new Ft):o=this.textureLoader.load(n);return this.textureLoader.setPath(i),o}parseMaterials(e){const t=new Map;if("Material"in Ke.Objects){const n=Ke.Objects.Material;for(const i in n){const r=this.parseMaterial(n[i],e);r!==null&&t.set(parseInt(i),r)}}return t}parseMaterial(e,t){const n=e.id,i=e.attrName;let r=e.ShadingModel;if(typeof r=="object"&&(r=r.value),!wt.has(n))return null;const o=this.parseParameters(e,t,n);let a;switch(r.toLowerCase()){case"phong":a=new Go;break;case"lambert":a=new Fs;break;default:console.warn('THREE.FBXLoader: unknown material type "%s". Defaulting to MeshPhongMaterial.',r),a=new Go;break}return a.setValues(o),a.name=i,a}parseParameters(e,t,n){const i={};e.BumpFactor&&(i.bumpScale=e.BumpFactor.value),e.Diffuse?i.color=new He().fromArray(e.Diffuse.value).convertSRGBToLinear():e.DiffuseColor&&(e.DiffuseColor.type==="Color"||e.DiffuseColor.type==="ColorRGB")&&(i.color=new He().fromArray(e.DiffuseColor.value).convertSRGBToLinear()),e.DisplacementFactor&&(i.displacementScale=e.DisplacementFactor.value),e.Emissive?i.emissive=new He().fromArray(e.Emissive.value).convertSRGBToLinear():e.EmissiveColor&&(e.EmissiveColor.type==="Color"||e.EmissiveColor.type==="ColorRGB")&&(i.emissive=new He().fromArray(e.EmissiveColor.value).convertSRGBToLinear()),e.EmissiveFactor&&(i.emissiveIntensity=parseFloat(e.EmissiveFactor.value)),e.Opacity&&(i.opacity=parseFloat(e.Opacity.value)),i.opacity<1&&(i.transparent=!0),e.ReflectionFactor&&(i.reflectivity=e.ReflectionFactor.value),e.Shininess&&(i.shininess=e.Shininess.value),e.Specular?i.specular=new He().fromArray(e.Specular.value).convertSRGBToLinear():e.SpecularColor&&e.SpecularColor.type==="Color"&&(i.specular=new He().fromArray(e.SpecularColor.value).convertSRGBToLinear());const r=this;return wt.get(n).children.forEach(function(o){const a=o.relationship;switch(a){case"Bump":i.bumpMap=r.getTexture(t,o.ID);break;case"Maya|TEX_ao_map":i.aoMap=r.getTexture(t,o.ID);break;case"DiffuseColor":case"Maya|TEX_color_map":i.map=r.getTexture(t,o.ID),i.map!==void 0&&(i.map.colorSpace=Tt);break;case"DisplacementColor":i.displacementMap=r.getTexture(t,o.ID);break;case"EmissiveColor":i.emissiveMap=r.getTexture(t,o.ID),i.emissiveMap!==void 0&&(i.emissiveMap.colorSpace=Tt);break;case"NormalMap":case"Maya|TEX_normal_map":i.normalMap=r.getTexture(t,o.ID);break;case"ReflectionColor":i.envMap=r.getTexture(t,o.ID),i.envMap!==void 0&&(i.envMap.mapping=zr,i.envMap.colorSpace=Tt);break;case"SpecularColor":i.specularMap=r.getTexture(t,o.ID),i.specularMap!==void 0&&(i.specularMap.colorSpace=Tt);break;case"TransparentColor":case"TransparencyFactor":i.alphaMap=r.getTexture(t,o.ID),i.transparent=!0;break;case"AmbientColor":case"ShininessExponent":case"SpecularFactor":case"VectorDisplacementColor":default:console.warn("THREE.FBXLoader: %s map is not supported in three.js, skipping texture.",a);break}}),i}getTexture(e,t){return"LayeredTexture"in Ke.Objects&&t in Ke.Objects.LayeredTexture&&(console.warn("THREE.FBXLoader: layered textures are not supported in three.js. Discarding all but first layer."),t=wt.get(t).children[0].ID),e.get(t)}parseDeformers(){const e={},t={};if("Deformer"in Ke.Objects){const n=Ke.Objects.Deformer;for(const i in n){const r=n[i],o=wt.get(parseInt(i));if(r.attrType==="Skin"){const a=this.parseSkeleton(o,n);a.ID=i,o.parents.length>1&&console.warn("THREE.FBXLoader: skeleton attached to more than one geometry is not supported."),a.geometryID=o.parents[0].ID,e[i]=a}else if(r.attrType==="BlendShape"){const a={id:i};a.rawTargets=this.parseMorphTargets(o,n),a.id=i,o.parents.length>1&&console.warn("THREE.FBXLoader: morph target attached to more than one geometry is not supported."),t[i]=a}}}return{skeletons:e,morphTargets:t}}parseSkeleton(e,t){const n=[];return e.children.forEach(function(i){const r=t[i.ID];if(r.attrType!=="Cluster")return;const o={ID:i.ID,indices:[],weights:[],transformLink:new Te().fromArray(r.TransformLink.a)};"Indexes"in r&&(o.indices=r.Indexes.a,o.weights=r.Weights.a),n.push(o)}),{rawBones:n,bones:[]}}parseMorphTargets(e,t){const n=[];for(let i=0;i<e.children.length;i++){const r=e.children[i],o=t[r.ID],a={name:o.attrName,initialWeight:o.DeformPercent,id:o.id,fullWeights:o.FullWeights.a};if(o.attrType!=="BlendShapeChannel")return;a.geoID=wt.get(parseInt(r.ID)).children.filter(function(l){return l.relationship===void 0})[0].ID,n.push(a)}return n}parseScene(e,t,n){Xt=new wn;const i=this.parseModels(e.skeletons,t,n),r=Ke.Objects.Model,o=this;i.forEach(function(l){const c=r[l.ID];o.setLookAtProperties(l,c),wt.get(l.ID).parents.forEach(function(u){const d=i.get(u.ID);d!==void 0&&d.add(l)}),l.parent===null&&Xt.add(l)}),this.bindSkeleton(e.skeletons,t,i),this.addGlobalSceneSettings(),Xt.traverse(function(l){if(l.userData.transformData){l.parent&&(l.userData.transformData.parentMatrix=l.parent.matrix,l.userData.transformData.parentMatrixWorld=l.parent.matrixWorld);const c=Eu(l.userData.transformData);l.applyMatrix4(c),l.updateWorldMatrix()}});const a=new qv().parse();Xt.children.length===1&&Xt.children[0].isGroup&&(Xt.children[0].animations=a,Xt=Xt.children[0]),Xt.animations=a}parseModels(e,t,n){const i=new Map,r=Ke.Objects.Model;for(const o in r){const a=parseInt(o),l=r[o],c=wt.get(a);let h=this.buildSkeleton(c,e,a,l.attrName);if(!h){switch(l.attrType){case"Camera":h=this.createCamera(c);break;case"Light":h=this.createLight(c);break;case"Mesh":h=this.createMesh(c,t,n);break;case"NurbsCurve":h=this.createCurve(c,t);break;case"LimbNode":case"Root":h=new ha;break;case"Null":default:h=new wn;break}h.name=l.attrName?st.sanitizeNodeName(l.attrName):"",h.userData.originalName=l.attrName,h.ID=a}this.getTransformData(h,l),i.set(a,h)}return i}buildSkeleton(e,t,n,i){let r=null;return e.parents.forEach(function(o){for(const a in t){const l=t[a];l.rawBones.forEach(function(c,h){if(c.ID===o.ID){const u=r;r=new ha,r.matrixWorld.copy(c.transformLink),r.name=i?st.sanitizeNodeName(i):"",r.userData.originalName=i,r.ID=n,l.bones[h]=r,u!==null&&r.add(u)}})}}),r}createCamera(e){let t,n;if(e.children.forEach(function(i){const r=Ke.Objects.NodeAttribute[i.ID];r!==void 0&&(n=r)}),n===void 0)t=new dt;else{let i=0;n.CameraProjectionType!==void 0&&n.CameraProjectionType.value===1&&(i=1);let r=1;n.NearPlane!==void 0&&(r=n.NearPlane.value/1e3);let o=1e3;n.FarPlane!==void 0&&(o=n.FarPlane.value/1e3);let a=window.innerWidth,l=window.innerHeight;n.AspectWidth!==void 0&&n.AspectHeight!==void 0&&(a=n.AspectWidth.value,l=n.AspectHeight.value);const c=a/l;let h=45;n.FieldOfView!==void 0&&(h=n.FieldOfView.value);const u=n.FocalLength?n.FocalLength.value:null;switch(i){case 0:t=new qt(h,c,r,o),u!==null&&t.setFocalLength(u);break;case 1:t=new Pa(-a/2,a/2,l/2,-l/2,r,o);break;default:console.warn("THREE.FBXLoader: Unknown camera type "+i+"."),t=new dt;break}}return t}createLight(e){let t,n;if(e.children.forEach(function(i){const r=Ke.Objects.NodeAttribute[i.ID];r!==void 0&&(n=r)}),n===void 0)t=new dt;else{let i;n.LightType===void 0?i=0:i=n.LightType.value;let r=16777215;n.Color!==void 0&&(r=new He().fromArray(n.Color.value).convertSRGBToLinear());let o=n.Intensity===void 0?1:n.Intensity.value/100;n.CastLightOnObject!==void 0&&n.CastLightOnObject.value===0&&(o=0);let a=0;n.FarAttenuationEnd!==void 0&&(n.EnableFarAttenuation!==void 0&&n.EnableFarAttenuation.value===0?a=0:a=n.FarAttenuationEnd.value);const l=1;switch(i){case 0:t=new kc(r,o,a,l);break;case 1:t=new hu(r,o);break;case 2:let c=Math.PI/3;n.InnerAngle!==void 0&&(c=Gt.degToRad(n.InnerAngle.value));let h=0;n.OuterAngle!==void 0&&(h=Gt.degToRad(n.OuterAngle.value),h=Math.max(h,1)),t=new J_(r,o,a,c,h,l);break;default:console.warn("THREE.FBXLoader: Unknown light type "+n.LightType.value+", defaulting to a PointLight."),t=new kc(r,o);break}n.CastShadows!==void 0&&n.CastShadows.value===1&&(t.castShadow=!0)}return t}createMesh(e,t,n){let i,r=null,o=null;const a=[];return e.children.forEach(function(l){t.has(l.ID)&&(r=t.get(l.ID)),n.has(l.ID)&&a.push(n.get(l.ID))}),a.length>1?o=a:a.length>0?o=a[0]:(o=new Go({name:Ri.DEFAULT_MATERIAL_NAME,color:13421772}),a.push(o)),"color"in r.attributes&&a.forEach(function(l){l.vertexColors=!0}),r.FBX_Deformer?(i=new g_(r,o),i.normalizeSkinWeights()):i=new ce(r,o),i}createCurve(e,t){const n=e.children.reduce(function(r,o){return t.has(o.ID)&&(r=t.get(o.ID)),r},null),i=new jn({name:Ri.DEFAULT_MATERIAL_NAME,color:3342591,linewidth:1});return new _n(n,i)}getTransformData(e,t){const n={};"InheritType"in t&&(n.inheritType=parseInt(t.InheritType.value)),"RotationOrder"in t?n.eulerOrder=bu(t.RotationOrder.value):n.eulerOrder="ZYX","Lcl_Translation"in t&&(n.translation=t.Lcl_Translation.value),"PreRotation"in t&&(n.preRotation=t.PreRotation.value),"Lcl_Rotation"in t&&(n.rotation=t.Lcl_Rotation.value),"PostRotation"in t&&(n.postRotation=t.PostRotation.value),"Lcl_Scaling"in t&&(n.scale=t.Lcl_Scaling.value),"ScalingOffset"in t&&(n.scalingOffset=t.ScalingOffset.value),"ScalingPivot"in t&&(n.scalingPivot=t.ScalingPivot.value),"RotationOffset"in t&&(n.rotationOffset=t.RotationOffset.value),"RotationPivot"in t&&(n.rotationPivot=t.RotationPivot.value),e.userData.transformData=n}setLookAtProperties(e,t){"LookAtProperty"in t&&wt.get(e.ID).children.forEach(function(i){if(i.relationship==="LookAtProperty"){const r=Ke.Objects.Model[i.ID];if("Lcl_Translation"in r){const o=r.Lcl_Translation.value;e.target!==void 0?(e.target.position.fromArray(o),Xt.add(e.target)):e.lookAt(new C().fromArray(o))}}})}bindSkeleton(e,t,n){const i=this.parsePoseNodes();for(const r in e){const o=e[r];wt.get(parseInt(o.ID)).parents.forEach(function(l){if(t.has(l.ID)){const c=l.ID;wt.get(c).parents.forEach(function(u){n.has(u.ID)&&n.get(u.ID).bind(new Ca(o.bones),i[u.ID])})}})}}parsePoseNodes(){const e={};if("Pose"in Ke.Objects){const t=Ke.Objects.Pose;for(const n in t)if(t[n].attrType==="BindPose"&&t[n].NbPoseNodes>0){const i=t[n].PoseNode;Array.isArray(i)?i.forEach(function(r){e[r.Node]=new Te().fromArray(r.Matrix.a)}):e[i.Node]=new Te().fromArray(i.Matrix.a)}}return e}addGlobalSceneSettings(){if("GlobalSettings"in Ke){if("AmbientColor"in Ke.GlobalSettings){const e=Ke.GlobalSettings.AmbientColor.value,t=e[0],n=e[1],i=e[2];if(t!==0||n!==0||i!==0){const r=new He(t,n,i).convertSRGBToLinear();Xt.add(new uu(r,1))}}"UnitScaleFactor"in Ke.GlobalSettings&&(Xt.userData.unitScaleFactor=Ke.GlobalSettings.UnitScaleFactor.value)}}}class Yv{constructor(){this.negativeMaterialIndices=!1}parse(e){const t=new Map;if("Geometry"in Ke.Objects){const n=Ke.Objects.Geometry;for(const i in n){const r=wt.get(parseInt(i)),o=this.parseGeometry(r,n[i],e);t.set(parseInt(i),o)}}return this.negativeMaterialIndices===!0&&console.warn("THREE.FBXLoader: The FBX file contains invalid (negative) material indices. The asset might not render as expected."),t}parseGeometry(e,t,n){switch(t.attrType){case"Mesh":return this.parseMeshGeometry(e,t,n);case"NurbsCurve":return this.parseNurbsGeometry(t)}}parseMeshGeometry(e,t,n){const i=n.skeletons,r=[],o=e.parents.map(function(u){return Ke.Objects.Model[u.ID]});if(o.length===0)return;const a=e.children.reduce(function(u,d){return i[d.ID]!==void 0&&(u=i[d.ID]),u},null);e.children.forEach(function(u){n.morphTargets[u.ID]!==void 0&&r.push(n.morphTargets[u.ID])});const l=o[0],c={};"RotationOrder"in l&&(c.eulerOrder=bu(l.RotationOrder.value)),"InheritType"in l&&(c.inheritType=parseInt(l.InheritType.value)),"GeometricTranslation"in l&&(c.translation=l.GeometricTranslation.value),"GeometricRotation"in l&&(c.rotation=l.GeometricRotation.value),"GeometricScaling"in l&&(c.scale=l.GeometricScaling.value);const h=Eu(c);return this.genGeometry(t,a,r,h)}genGeometry(e,t,n,i){const r=new yt;e.attrName&&(r.name=e.attrName);const o=this.parseGeoNode(e,t),a=this.genBuffers(o),l=new nt(a.vertex,3);if(l.applyMatrix4(i),r.setAttribute("position",l),a.colors.length>0&&r.setAttribute("color",new nt(a.colors,3)),t&&(r.setAttribute("skinIndex",new Ta(a.weightsIndices,4)),r.setAttribute("skinWeight",new nt(a.vertexWeights,4)),r.FBX_Deformer=t),a.normal.length>0){const c=new $e().getNormalMatrix(i),h=new nt(a.normal,3);h.applyNormalMatrix(c),r.setAttribute("normal",h)}if(a.uvs.forEach(function(c,h){const u=h===0?"uv":`uv${h}`;r.setAttribute(u,new nt(a.uvs[h],2))}),o.material&&o.material.mappingType!=="AllSame"){let c=a.materialIndex[0],h=0;if(a.materialIndex.forEach(function(u,d){u!==c&&(r.addGroup(h,d-h,c),c=u,h=d)}),r.groups.length>0){const u=r.groups[r.groups.length-1],d=u.start+u.count;d!==a.materialIndex.length&&r.addGroup(d,a.materialIndex.length-d,c)}r.groups.length===0&&r.addGroup(0,a.materialIndex.length,a.materialIndex[0])}return this.addMorphTargets(r,e,n,i),r}parseGeoNode(e,t){const n={};if(n.vertexPositions=e.Vertices!==void 0?e.Vertices.a:[],n.vertexIndices=e.PolygonVertexIndex!==void 0?e.PolygonVertexIndex.a:[],e.LayerElementColor&&(n.color=this.parseVertexColors(e.LayerElementColor[0])),e.LayerElementMaterial&&(n.material=this.parseMaterialIndices(e.LayerElementMaterial[0])),e.LayerElementNormal&&(n.normal=this.parseNormals(e.LayerElementNormal[0])),e.LayerElementUV){n.uv=[];let i=0;for(;e.LayerElementUV[i];)e.LayerElementUV[i].UV&&n.uv.push(this.parseUVs(e.LayerElementUV[i])),i++}return n.weightTable={},t!==null&&(n.skeleton=t,t.rawBones.forEach(function(i,r){i.indices.forEach(function(o,a){n.weightTable[o]===void 0&&(n.weightTable[o]=[]),n.weightTable[o].push({id:r,weight:i.weights[a]})})})),n}genBuffers(e){const t={vertex:[],normal:[],colors:[],uvs:[],materialIndex:[],vertexWeights:[],weightsIndices:[]};let n=0,i=0,r=!1,o=[],a=[],l=[],c=[],h=[],u=[];const d=this;return e.vertexIndices.forEach(function(p,g){let _,m=!1;p<0&&(p=p^-1,m=!0);let f=[],x=[];if(o.push(p*3,p*3+1,p*3+2),e.color){const v=Fr(g,n,p,e.color);l.push(v[0],v[1],v[2])}if(e.skeleton){if(e.weightTable[p]!==void 0&&e.weightTable[p].forEach(function(v){x.push(v.weight),f.push(v.id)}),x.length>4){r||(console.warn("THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights."),r=!0);const v=[0,0,0,0],M=[0,0,0,0];x.forEach(function(y,b){let w=y,U=f[b];M.forEach(function(S,E,L){if(w>S){L[E]=w,w=S;const F=v[E];v[E]=U,U=F}})}),f=v,x=M}for(;x.length<4;)x.push(0),f.push(0);for(let v=0;v<4;++v)h.push(x[v]),u.push(f[v])}if(e.normal){const v=Fr(g,n,p,e.normal);a.push(v[0],v[1],v[2])}e.material&&e.material.mappingType!=="AllSame"&&(_=Fr(g,n,p,e.material)[0],_<0&&(d.negativeMaterialIndices=!0,_=0)),e.uv&&e.uv.forEach(function(v,M){const y=Fr(g,n,p,v);c[M]===void 0&&(c[M]=[]),c[M].push(y[0]),c[M].push(y[1])}),i++,m&&(d.genFace(t,e,o,_,a,l,c,h,u,i),n++,i=0,o=[],a=[],l=[],c=[],h=[],u=[])}),t}getNormalNewell(e){const t=new C(0,0,0);for(let n=0;n<e.length;n++){const i=e[n],r=e[(n+1)%e.length];t.x+=(i.y-r.y)*(i.z+r.z),t.y+=(i.z-r.z)*(i.x+r.x),t.z+=(i.x-r.x)*(i.y+r.y)}return t.normalize(),t}getNormalTangentAndBitangent(e){const t=this.getNormalNewell(e),i=(Math.abs(t.z)>.5?new C(0,1,0):new C(0,0,1)).cross(t).normalize(),r=t.clone().cross(i).normalize();return{normal:t,tangent:i,bitangent:r}}flattenVertex(e,t,n){return new Le(e.dot(t),e.dot(n))}genFace(e,t,n,i,r,o,a,l,c,h){let u;if(h>3){const d=[];for(let m=0;m<n.length;m+=3)d.push(new C(t.vertexPositions[n[m]],t.vertexPositions[n[m+1]],t.vertexPositions[n[m+2]]));const{tangent:p,bitangent:g}=this.getNormalTangentAndBitangent(d),_=[];for(const m of d)_.push(this.flattenVertex(m,p,g));u=Ia.triangulateShape(_,[])}else u=[[0,1,2]];for(const[d,p,g]of u)e.vertex.push(t.vertexPositions[n[d*3]]),e.vertex.push(t.vertexPositions[n[d*3+1]]),e.vertex.push(t.vertexPositions[n[d*3+2]]),e.vertex.push(t.vertexPositions[n[p*3]]),e.vertex.push(t.vertexPositions[n[p*3+1]]),e.vertex.push(t.vertexPositions[n[p*3+2]]),e.vertex.push(t.vertexPositions[n[g*3]]),e.vertex.push(t.vertexPositions[n[g*3+1]]),e.vertex.push(t.vertexPositions[n[g*3+2]]),t.skeleton&&(e.vertexWeights.push(l[d*4]),e.vertexWeights.push(l[d*4+1]),e.vertexWeights.push(l[d*4+2]),e.vertexWeights.push(l[d*4+3]),e.vertexWeights.push(l[p*4]),e.vertexWeights.push(l[p*4+1]),e.vertexWeights.push(l[p*4+2]),e.vertexWeights.push(l[p*4+3]),e.vertexWeights.push(l[g*4]),e.vertexWeights.push(l[g*4+1]),e.vertexWeights.push(l[g*4+2]),e.vertexWeights.push(l[g*4+3]),e.weightsIndices.push(c[d*4]),e.weightsIndices.push(c[d*4+1]),e.weightsIndices.push(c[d*4+2]),e.weightsIndices.push(c[d*4+3]),e.weightsIndices.push(c[p*4]),e.weightsIndices.push(c[p*4+1]),e.weightsIndices.push(c[p*4+2]),e.weightsIndices.push(c[p*4+3]),e.weightsIndices.push(c[g*4]),e.weightsIndices.push(c[g*4+1]),e.weightsIndices.push(c[g*4+2]),e.weightsIndices.push(c[g*4+3])),t.color&&(e.colors.push(o[d*3]),e.colors.push(o[d*3+1]),e.colors.push(o[d*3+2]),e.colors.push(o[p*3]),e.colors.push(o[p*3+1]),e.colors.push(o[p*3+2]),e.colors.push(o[g*3]),e.colors.push(o[g*3+1]),e.colors.push(o[g*3+2])),t.material&&t.material.mappingType!=="AllSame"&&(e.materialIndex.push(i),e.materialIndex.push(i),e.materialIndex.push(i)),t.normal&&(e.normal.push(r[d*3]),e.normal.push(r[d*3+1]),e.normal.push(r[d*3+2]),e.normal.push(r[p*3]),e.normal.push(r[p*3+1]),e.normal.push(r[p*3+2]),e.normal.push(r[g*3]),e.normal.push(r[g*3+1]),e.normal.push(r[g*3+2])),t.uv&&t.uv.forEach(function(_,m){e.uvs[m]===void 0&&(e.uvs[m]=[]),e.uvs[m].push(a[m][d*2]),e.uvs[m].push(a[m][d*2+1]),e.uvs[m].push(a[m][p*2]),e.uvs[m].push(a[m][p*2+1]),e.uvs[m].push(a[m][g*2]),e.uvs[m].push(a[m][g*2+1])})}addMorphTargets(e,t,n,i){if(n.length===0)return;e.morphTargetsRelative=!0,e.morphAttributes.position=[];const r=this;n.forEach(function(o){o.rawTargets.forEach(function(a){const l=Ke.Objects.Geometry[a.geoID];l!==void 0&&r.genMorphGeometry(e,t,l,i,a.name)})})}genMorphGeometry(e,t,n,i,r){const o=t.PolygonVertexIndex!==void 0?t.PolygonVertexIndex.a:[],a=n.Vertices!==void 0?n.Vertices.a:[],l=n.Indexes!==void 0?n.Indexes.a:[],c=e.attributes.position.count*3,h=new Float32Array(c);for(let g=0;g<l.length;g++){const _=l[g]*3;h[_]=a[g*3],h[_+1]=a[g*3+1],h[_+2]=a[g*3+2]}const u={vertexIndices:o,vertexPositions:h},d=this.genBuffers(u),p=new nt(d.vertex,3);p.name=r||n.attrName,p.applyMatrix4(i),e.morphAttributes.position.push(p)}parseNormals(e){const t=e.MappingInformationType,n=e.ReferenceInformationType,i=e.Normals.a;let r=[];return n==="IndexToDirect"&&("NormalIndex"in e?r=e.NormalIndex.a:"NormalsIndex"in e&&(r=e.NormalsIndex.a)),{dataSize:3,buffer:i,indices:r,mappingType:t,referenceType:n}}parseUVs(e){const t=e.MappingInformationType,n=e.ReferenceInformationType,i=e.UV.a;let r=[];return n==="IndexToDirect"&&(r=e.UVIndex.a),{dataSize:2,buffer:i,indices:r,mappingType:t,referenceType:n}}parseVertexColors(e){const t=e.MappingInformationType,n=e.ReferenceInformationType,i=e.Colors.a;let r=[];n==="IndexToDirect"&&(r=e.ColorIndex.a);for(let o=0,a=new He;o<i.length;o+=4)a.fromArray(i,o).convertSRGBToLinear().toArray(i,o);return{dataSize:4,buffer:i,indices:r,mappingType:t,referenceType:n}}parseMaterialIndices(e){const t=e.MappingInformationType,n=e.ReferenceInformationType;if(t==="NoMappingInformation")return{dataSize:1,buffer:[0],indices:[0],mappingType:"AllSame",referenceType:n};const i=e.Materials.a,r=[];for(let o=0;o<i.length;++o)r.push(o);return{dataSize:1,buffer:i,indices:r,mappingType:t,referenceType:n}}parseNurbsGeometry(e){const t=parseInt(e.Order);if(isNaN(t))return console.error("THREE.FBXLoader: Invalid Order %s given for geometry ID: %s",e.Order,e.id),new yt;const n=t-1,i=e.KnotVector.a,r=[],o=e.Points.a;for(let u=0,d=o.length;u<d;u+=4)r.push(new ot().fromArray(o,u));let a,l;if(e.Form==="Closed")r.push(r[0]);else if(e.Form==="Periodic"){a=n,l=i.length-1-a;for(let u=0;u<n;++u)r.push(r[u])}const h=new Vv(n,i,r,a,l).getPoints(r.length*12);return new yt().setFromPoints(h)}}class qv{parse(){const e=[],t=this.parseClips();if(t!==void 0)for(const n in t){const i=t[n],r=this.addClip(i);e.push(r)}return e}parseClips(){if(Ke.Objects.AnimationCurve===void 0)return;const e=this.parseAnimationCurveNodes();this.parseAnimationCurves(e);const t=this.parseAnimationLayers(e);return this.parseAnimStacks(t)}parseAnimationCurveNodes(){const e=Ke.Objects.AnimationCurveNode,t=new Map;for(const n in e){const i=e[n];if(i.attrName.match(/S|R|T|DeformPercent/)!==null){const r={id:i.id,attr:i.attrName,curves:{}};t.set(r.id,r)}}return t}parseAnimationCurves(e){const t=Ke.Objects.AnimationCurve;for(const n in t){const i={id:t[n].id,times:t[n].KeyTime.a.map(Qv),values:t[n].KeyValueFloat.a},r=wt.get(i.id);if(r!==void 0){const o=r.parents[0].ID,a=r.parents[0].relationship;a.match(/X/)?e.get(o).curves.x=i:a.match(/Y/)?e.get(o).curves.y=i:a.match(/Z/)?e.get(o).curves.z=i:a.match(/DeformPercent/)&&e.has(o)&&(e.get(o).curves.morph=i)}}}parseAnimationLayers(e){const t=Ke.Objects.AnimationLayer,n=new Map;for(const i in t){const r=[],o=wt.get(parseInt(i));o!==void 0&&(o.children.forEach(function(l,c){if(e.has(l.ID)){const h=e.get(l.ID);if(h.curves.x!==void 0||h.curves.y!==void 0||h.curves.z!==void 0){if(r[c]===void 0){const u=wt.get(l.ID).parents.filter(function(d){return d.relationship!==void 0})[0].ID;if(u!==void 0){const d=Ke.Objects.Model[u.toString()];if(d===void 0){console.warn("THREE.FBXLoader: Encountered a unused curve.",l);return}const p={modelName:d.attrName?st.sanitizeNodeName(d.attrName):"",ID:d.id,initialPosition:[0,0,0],initialRotation:[0,0,0],initialScale:[1,1,1]};Xt.traverse(function(g){g.ID===d.id&&(p.transform=g.matrix,g.userData.transformData&&(p.eulerOrder=g.userData.transformData.eulerOrder))}),p.transform||(p.transform=new Te),"PreRotation"in d&&(p.preRotation=d.PreRotation.value),"PostRotation"in d&&(p.postRotation=d.PostRotation.value),r[c]=p}}r[c]&&(r[c][h.attr]=h)}else if(h.curves.morph!==void 0){if(r[c]===void 0){const u=wt.get(l.ID).parents.filter(function(f){return f.relationship!==void 0})[0].ID,d=wt.get(u).parents[0].ID,p=wt.get(d).parents[0].ID,g=wt.get(p).parents[0].ID,_=Ke.Objects.Model[g],m={modelName:_.attrName?st.sanitizeNodeName(_.attrName):"",morphName:Ke.Objects.Deformer[u].attrName};r[c]=m}r[c][h.attr]=h}}}),n.set(parseInt(i),r))}return n}parseAnimStacks(e){const t=Ke.Objects.AnimationStack,n={};for(const i in t){const r=wt.get(parseInt(i)).children;r.length>1&&console.warn("THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers.");const o=e.get(r[0].ID);n[i]={name:t[i].attrName,layer:o}}return n}addClip(e){let t=[];const n=this;return e.layer.forEach(function(i){t=t.concat(n.generateTracks(i))}),new V_(e.name,-1,t)}generateTracks(e){const t=[];let n=new C,i=new C;if(e.transform&&e.transform.decompose(n,new ut,i),n=n.toArray(),i=i.toArray(),e.T!==void 0&&Object.keys(e.T.curves).length>0){const r=this.generateVectorTrack(e.modelName,e.T.curves,n,"position");r!==void 0&&t.push(r)}if(e.R!==void 0&&Object.keys(e.R.curves).length>0){const r=this.generateRotationTrack(e.modelName,e.R.curves,e.preRotation,e.postRotation,e.eulerOrder);r!==void 0&&t.push(r)}if(e.S!==void 0&&Object.keys(e.S.curves).length>0){const r=this.generateVectorTrack(e.modelName,e.S.curves,i,"scale");r!==void 0&&t.push(r)}if(e.DeformPercent!==void 0){const r=this.generateMorphTrack(e);r!==void 0&&t.push(r)}return t}generateVectorTrack(e,t,n,i){const r=this.getTimesForAllAxes(t),o=this.getKeyframeTrackValues(r,t,n);return new Xs(e+"."+i,r,o)}generateRotationTrack(e,t,n,i,r){let o,a;if(t.x!==void 0&&t.y!==void 0&&t.z!==void 0){const u=this.interpolateRotations(t.x,t.y,t.z,r);o=u[0],a=u[1]}n!==void 0&&(n=n.map(Gt.degToRad),n.push(r),n=new Yt().fromArray(n),n=new ut().setFromEuler(n)),i!==void 0&&(i=i.map(Gt.degToRad),i.push(r),i=new Yt().fromArray(i),i=new ut().setFromEuler(i).invert());const l=new ut,c=new Yt,h=[];if(!a||!o)return new Pi(e+".quaternion",[],[]);for(let u=0;u<a.length;u+=3)c.set(a[u],a[u+1],a[u+2],r),l.setFromEuler(c),n!==void 0&&l.premultiply(n),i!==void 0&&l.multiply(i),u>2&&new ut().fromArray(h,(u-3)/3*4).dot(l)<0&&l.set(-l.x,-l.y,-l.z,-l.w),l.toArray(h,u/3*4);return new Pi(e+".quaternion",o,h)}generateMorphTrack(e){const t=e.DeformPercent.curves.morph,n=t.values.map(function(r){return r/100}),i=Xt.getObjectByName(e.modelName).morphTargetDictionary[e.morphName];return new Ws(e.modelName+".morphTargetInfluences["+i+"]",t.times,n)}getTimesForAllAxes(e){let t=[];if(e.x!==void 0&&(t=t.concat(e.x.times)),e.y!==void 0&&(t=t.concat(e.y.times)),e.z!==void 0&&(t=t.concat(e.z.times)),t=t.sort(function(n,i){return n-i}),t.length>1){let n=1,i=t[0];for(let r=1;r<t.length;r++){const o=t[r];o!==i&&(t[n]=o,i=o,n++)}t=t.slice(0,n)}return t}getKeyframeTrackValues(e,t,n){const i=n,r=[];let o=-1,a=-1,l=-1;return e.forEach(function(c){if(t.x&&(o=t.x.times.indexOf(c)),t.y&&(a=t.y.times.indexOf(c)),t.z&&(l=t.z.times.indexOf(c)),o!==-1){const h=t.x.values[o];r.push(h),i[0]=h}else r.push(i[0]);if(a!==-1){const h=t.y.values[a];r.push(h),i[1]=h}else r.push(i[1]);if(l!==-1){const h=t.z.values[l];r.push(h),i[2]=h}else r.push(i[2])}),r}interpolateRotations(e,t,n,i){const r=[],o=[];r.push(e.times[0]),o.push(Gt.degToRad(e.values[0])),o.push(Gt.degToRad(t.values[0])),o.push(Gt.degToRad(n.values[0]));for(let a=1;a<e.values.length;a++){const l=[e.values[a-1],t.values[a-1],n.values[a-1]];if(isNaN(l[0])||isNaN(l[1])||isNaN(l[2]))continue;const c=l.map(Gt.degToRad),h=[e.values[a],t.values[a],n.values[a]];if(isNaN(h[0])||isNaN(h[1])||isNaN(h[2]))continue;const u=h.map(Gt.degToRad),d=[h[0]-l[0],h[1]-l[1],h[2]-l[2]],p=[Math.abs(d[0]),Math.abs(d[1]),Math.abs(d[2])];if(p[0]>=180||p[1]>=180||p[2]>=180){const _=Math.max(...p)/180,m=new Yt(...c,i),f=new Yt(...u,i),x=new ut().setFromEuler(m),v=new ut().setFromEuler(f);x.dot(v)&&v.set(-v.x,-v.y,-v.z,-v.w);const M=e.times[a-1],y=e.times[a]-M,b=new ut,w=new Yt;for(let U=0;U<1;U+=1/_)b.copy(x.clone().slerp(v.clone(),U)),r.push(M+U*y),w.setFromQuaternion(b,i),o.push(w.x),o.push(w.y),o.push(w.z)}else r.push(e.times[a]),o.push(Gt.degToRad(e.values[a])),o.push(Gt.degToRad(t.values[a])),o.push(Gt.degToRad(n.values[a]))}return[r,o]}}class jv{getPrevNode(){return this.nodeStack[this.currentIndent-2]}getCurrentNode(){return this.nodeStack[this.currentIndent-1]}getCurrentProp(){return this.currentProp}pushStack(e){this.nodeStack.push(e),this.currentIndent+=1}popStack(){this.nodeStack.pop(),this.currentIndent-=1}setCurrentProp(e,t){this.currentProp=e,this.currentPropName=t}parse(e){this.currentIndent=0,this.allNodes=new Su,this.nodeStack=[],this.currentProp=[],this.currentPropName="";const t=this,n=e.split(/[\r\n]+/);return n.forEach(function(i,r){const o=i.match(/^[\s\t]*;/),a=i.match(/^[\s\t]*$/);if(o||a)return;const l=i.match("^\\t{"+t.currentIndent+"}(\\w+):(.*){",""),c=i.match("^\\t{"+t.currentIndent+"}(\\w+):[\\s\\t\\r\\n](.*)"),h=i.match("^\\t{"+(t.currentIndent-1)+"}}");l?t.parseNodeBegin(i,l):c?t.parseNodeProperty(i,c,n[++r]):h?t.popStack():i.match(/^[^\s\t}]/)&&t.parseNodePropertyContinued(i)}),this.allNodes}parseNodeBegin(e,t){const n=t[1].trim().replace(/^"/,"").replace(/"$/,""),i=t[2].split(",").map(function(l){return l.trim().replace(/^"/,"").replace(/"$/,"")}),r={name:n},o=this.parseNodeAttr(i),a=this.getCurrentNode();this.currentIndent===0?this.allNodes.add(n,r):n in a?(n==="PoseNode"?a.PoseNode.push(r):a[n].id!==void 0&&(a[n]={},a[n][a[n].id]=a[n]),o.id!==""&&(a[n][o.id]=r)):typeof o.id=="number"?(a[n]={},a[n][o.id]=r):n!=="Properties70"&&(n==="PoseNode"?a[n]=[r]:a[n]=r),typeof o.id=="number"&&(r.id=o.id),o.name!==""&&(r.attrName=o.name),o.type!==""&&(r.attrType=o.type),this.pushStack(r)}parseNodeAttr(e){let t=e[0];e[0]!==""&&(t=parseInt(e[0]),isNaN(t)&&(t=e[0]));let n="",i="";return e.length>1&&(n=e[1].replace(/^(\w+)::/,""),i=e[2]),{id:t,name:n,type:i}}parseNodeProperty(e,t,n){let i=t[1].replace(/^"/,"").replace(/"$/,"").trim(),r=t[2].replace(/^"/,"").replace(/"$/,"").trim();i==="Content"&&r===","&&(r=n.replace(/"/g,"").replace(/,$/,"").trim());const o=this.getCurrentNode();if(o.name==="Properties70"){this.parseNodeSpecialProperty(e,i,r);return}if(i==="C"){const l=r.split(",").slice(1),c=parseInt(l[0]),h=parseInt(l[1]);let u=r.split(",").slice(3);u=u.map(function(d){return d.trim().replace(/^"/,"")}),i="connections",r=[c,h],ex(r,u),o[i]===void 0&&(o[i]=[])}i==="Node"&&(o.id=r),i in o&&Array.isArray(o[i])?o[i].push(r):i!=="a"?o[i]=r:o.a=r,this.setCurrentProp(o,i),i==="a"&&r.slice(-1)!==","&&(o.a=Qo(r))}parseNodePropertyContinued(e){const t=this.getCurrentNode();t.a+=e,e.slice(-1)!==","&&(t.a=Qo(t.a))}parseNodeSpecialProperty(e,t,n){const i=n.split('",').map(function(h){return h.trim().replace(/^\"/,"").replace(/\s/,"_")}),r=i[0],o=i[1],a=i[2],l=i[3];let c=i[4];switch(o){case"int":case"enum":case"bool":case"ULongLong":case"double":case"Number":case"FieldOfView":c=parseFloat(c);break;case"Color":case"ColorRGB":case"Vector3D":case"Lcl_Translation":case"Lcl_Rotation":case"Lcl_Scaling":c=Qo(c);break}this.getPrevNode()[r]={type:o,type2:a,flag:l,value:c},this.setCurrentProp(this.getPrevNode(),r)}}class Zv{parse(e){const t=new th(e);t.skip(23);const n=t.getUint32();if(n<6400)throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: "+n);const i=new Su;for(;!this.endOfContent(t);){const r=this.parseNode(t,n);r!==null&&i.add(r.name,r)}return i}endOfContent(e){return e.size()%16===0?(e.getOffset()+160+16&-16)>=e.size():e.getOffset()+160+16>=e.size()}parseNode(e,t){const n={},i=t>=7500?e.getUint64():e.getUint32(),r=t>=7500?e.getUint64():e.getUint32();t>=7500?e.getUint64():e.getUint32();const o=e.getUint8(),a=e.getString(o);if(i===0)return null;const l=[];for(let d=0;d<r;d++)l.push(this.parseProperty(e));const c=l.length>0?l[0]:"",h=l.length>1?l[1]:"",u=l.length>2?l[2]:"";for(n.singleProperty=r===1&&e.getOffset()===i;i>e.getOffset();){const d=this.parseNode(e,t);d!==null&&this.parseSubNode(a,n,d)}return n.propertyList=l,typeof c=="number"&&(n.id=c),h!==""&&(n.attrName=h),u!==""&&(n.attrType=u),a!==""&&(n.name=a),n}parseSubNode(e,t,n){if(n.singleProperty===!0){const i=n.propertyList[0];Array.isArray(i)?(t[n.name]=n,n.a=i):t[n.name]=i}else if(e==="Connections"&&n.name==="C"){const i=[];n.propertyList.forEach(function(r,o){o!==0&&i.push(r)}),t.connections===void 0&&(t.connections=[]),t.connections.push(i)}else if(n.name==="Properties70")Object.keys(n).forEach(function(r){t[r]=n[r]});else if(e==="Properties70"&&n.name==="P"){let i=n.propertyList[0],r=n.propertyList[1];const o=n.propertyList[2],a=n.propertyList[3];let l;i.indexOf("Lcl ")===0&&(i=i.replace("Lcl ","Lcl_")),r.indexOf("Lcl ")===0&&(r=r.replace("Lcl ","Lcl_")),r==="Color"||r==="ColorRGB"||r==="Vector"||r==="Vector3D"||r.indexOf("Lcl_")===0?l=[n.propertyList[4],n.propertyList[5],n.propertyList[6]]:l=n.propertyList[4],t[i]={type:r,type2:o,flag:a,value:l}}else t[n.name]===void 0?typeof n.id=="number"?(t[n.name]={},t[n.name][n.id]=n):t[n.name]=n:n.name==="PoseNode"?(Array.isArray(t[n.name])||(t[n.name]=[t[n.name]]),t[n.name].push(n)):t[n.name][n.id]===void 0&&(t[n.name][n.id]=n)}parseProperty(e){const t=e.getString(1);let n;switch(t){case"C":return e.getBoolean();case"D":return e.getFloat64();case"F":return e.getFloat32();case"I":return e.getInt32();case"L":return e.getInt64();case"R":return n=e.getUint32(),e.getArrayBuffer(n);case"S":return n=e.getUint32(),e.getString(n);case"Y":return e.getInt16();case"b":case"c":case"d":case"f":case"i":case"l":const i=e.getUint32(),r=e.getUint32(),o=e.getUint32();if(r===0)switch(t){case"b":case"c":return e.getBooleanArray(i);case"d":return e.getFloat64Array(i);case"f":return e.getFloat32Array(i);case"i":return e.getInt32Array(i);case"l":return e.getInt64Array(i)}const a=Dv(new Uint8Array(e.getArrayBuffer(o))),l=new th(a.buffer);switch(t){case"b":case"c":return l.getBooleanArray(i);case"d":return l.getFloat64Array(i);case"f":return l.getFloat32Array(i);case"i":return l.getInt32Array(i);case"l":return l.getInt64Array(i)}break;default:throw new Error("THREE.FBXLoader: Unknown property type "+t)}}}class th{constructor(e,t){this.dv=new DataView(e),this.offset=0,this.littleEndian=t!==void 0?t:!0,this._textDecoder=new TextDecoder}getOffset(){return this.offset}size(){return this.dv.buffer.byteLength}skip(e){this.offset+=e}getBoolean(){return(this.getUint8()&1)===1}getBooleanArray(e){const t=[];for(let n=0;n<e;n++)t.push(this.getBoolean());return t}getUint8(){const e=this.dv.getUint8(this.offset);return this.offset+=1,e}getInt16(){const e=this.dv.getInt16(this.offset,this.littleEndian);return this.offset+=2,e}getInt32(){const e=this.dv.getInt32(this.offset,this.littleEndian);return this.offset+=4,e}getInt32Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getInt32());return t}getUint32(){const e=this.dv.getUint32(this.offset,this.littleEndian);return this.offset+=4,e}getInt64(){let e,t;return this.littleEndian?(e=this.getUint32(),t=this.getUint32()):(t=this.getUint32(),e=this.getUint32()),t&2147483648?(t=~t&4294967295,e=~e&4294967295,e===4294967295&&(t=t+1&4294967295),e=e+1&4294967295,-(t*4294967296+e)):t*4294967296+e}getInt64Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getInt64());return t}getUint64(){let e,t;return this.littleEndian?(e=this.getUint32(),t=this.getUint32()):(t=this.getUint32(),e=this.getUint32()),t*4294967296+e}getFloat32(){const e=this.dv.getFloat32(this.offset,this.littleEndian);return this.offset+=4,e}getFloat32Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getFloat32());return t}getFloat64(){const e=this.dv.getFloat64(this.offset,this.littleEndian);return this.offset+=8,e}getFloat64Array(e){const t=[];for(let n=0;n<e;n++)t.push(this.getFloat64());return t}getArrayBuffer(e){const t=this.dv.buffer.slice(this.offset,this.offset+e);return this.offset+=e,t}getString(e){const t=this.offset;let n=new Uint8Array(this.dv.buffer,t,e);this.skip(e);const i=n.indexOf(0);return i>=0&&(n=new Uint8Array(this.dv.buffer,t,i)),this._textDecoder.decode(n)}}class Su{add(e,t){this[e]=t}}function Kv(s){const e="Kaydara FBX Binary  \0";return s.byteLength>=e.length&&e===wu(s,0,e.length)}function $v(s){const e=["K","a","y","d","a","r","a","\\","F","B","X","\\","B","i","n","a","r","y","\\","\\"];let t=0;function n(i){const r=s[i-1];return s=s.slice(t+i),t++,r}for(let i=0;i<e.length;++i)if(n(1)===e[i])return!1;return!0}function nh(s){const e=/FBXVersion: (\d+)/,t=s.match(e);if(t)return parseInt(t[1]);throw new Error("THREE.FBXLoader: Cannot find the version number for the file given.")}function Qv(s){return s/46186158e3}const Jv=[];function Fr(s,e,t,n){let i;switch(n.mappingType){case"ByPolygonVertex":i=s;break;case"ByPolygon":i=e;break;case"ByVertice":i=t;break;case"AllSame":i=n.indices[0];break;default:console.warn("THREE.FBXLoader: unknown attribute mapping type "+n.mappingType)}n.referenceType==="IndexToDirect"&&(i=n.indices[i]);const r=i*n.dataSize,o=r+n.dataSize;return tx(Jv,n.buffer,r,o)}const $o=new Yt,Qi=new C;function Eu(s){const e=new Te,t=new Te,n=new Te,i=new Te,r=new Te,o=new Te,a=new Te,l=new Te,c=new Te,h=new Te,u=new Te,d=new Te,p=s.inheritType?s.inheritType:0;if(s.translation&&e.setPosition(Qi.fromArray(s.translation)),s.preRotation){const E=s.preRotation.map(Gt.degToRad);E.push(s.eulerOrder||Yt.DEFAULT_ORDER),t.makeRotationFromEuler($o.fromArray(E))}if(s.rotation){const E=s.rotation.map(Gt.degToRad);E.push(s.eulerOrder||Yt.DEFAULT_ORDER),n.makeRotationFromEuler($o.fromArray(E))}if(s.postRotation){const E=s.postRotation.map(Gt.degToRad);E.push(s.eulerOrder||Yt.DEFAULT_ORDER),i.makeRotationFromEuler($o.fromArray(E)),i.invert()}s.scale&&r.scale(Qi.fromArray(s.scale)),s.scalingOffset&&a.setPosition(Qi.fromArray(s.scalingOffset)),s.scalingPivot&&o.setPosition(Qi.fromArray(s.scalingPivot)),s.rotationOffset&&l.setPosition(Qi.fromArray(s.rotationOffset)),s.rotationPivot&&c.setPosition(Qi.fromArray(s.rotationPivot)),s.parentMatrixWorld&&(u.copy(s.parentMatrix),h.copy(s.parentMatrixWorld));const g=t.clone().multiply(n).multiply(i),_=new Te;_.extractRotation(h);const m=new Te;m.copyPosition(h);const f=m.clone().invert().multiply(h),x=_.clone().invert().multiply(f),v=r,M=new Te;if(p===0)M.copy(_).multiply(g).multiply(x).multiply(v);else if(p===1)M.copy(_).multiply(x).multiply(g).multiply(v);else{const L=new Te().scale(new C().setFromMatrixScale(u)).clone().invert(),F=x.clone().multiply(L);M.copy(_).multiply(g).multiply(F).multiply(v)}const y=c.clone().invert(),b=o.clone().invert();let w=e.clone().multiply(l).multiply(c).multiply(t).multiply(n).multiply(i).multiply(y).multiply(a).multiply(o).multiply(r).multiply(b);const U=new Te().copyPosition(w),S=h.clone().multiply(U);return d.copyPosition(S),w=d.clone().multiply(M),w.premultiply(h.invert()),w}function bu(s){s=s||0;const e=["ZYX","YZX","XZY","ZXY","YXZ","XYZ"];return s===6?(console.warn("THREE.FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect."),e[0]):e[s]}function Qo(s){return s.split(",").map(function(t){return parseFloat(t)})}function wu(s,e,t){return e===void 0&&(e=0),t===void 0&&(t=s.byteLength),new TextDecoder().decode(new Uint8Array(s,e,t))}function ex(s,e){for(let t=0,n=s.length,i=e.length;t<i;t++,n++)s[n]=e[t]}function tx(s,e,t,n){for(let i=t,r=0;i<n;i++,r++)s[r]=e[i];return s}const nx=new Wv,is=new Map,Jo=new Map;function ga(s,e=.08){const t=(s==null?void 0:s.color)??8947848,n=new Fs({color:t});if((s==null?void 0:s.placeholderShape)==="signpost"||(s==null?void 0:s.id)==="sign"){const l=new wn,c=1,h=.04,u=new bt(h,h*1.1,c,8),d=new ce(u,n);d.position.y=c/2,l.add(d);const p=.5,g=.25,_=.04,m=new ht(p,_,g),f=new ce(m,n);return f.position.y=c+_/2,l.add(f),l.rotation.x=Math.PI/2,l}let i,r;const o=1;switch((s==null?void 0:s.placeholderShape)??"sphere"){case"sphere":i=new Ai(o/2,8,6),r=new ce(i,n),r.position.y=o/2;break;case"cylinder":i=new bt(o*.2,o*.25,o,8),r=new ce(i,n),r.position.y=o/2;break;case"cone":i=new Qr(o*.3,o,8),r=new ce(i,n),r.position.y=o/2;break;case"box":i=new ht(o*.2,o,o*.1),r=new ce(i,n),r.position.y=o/2;break;default:i=new Ai(o/2,8,6),r=new ce(i,n),r.position.y=o/2}const a=new wn;return a.add(r),a.rotation.x=-Math.PI/2,a}function ix(s){s.traverse(o=>{o.isMesh&&(o.castShadow=!0,o.receiveShadow=!0)});const e=new Li().setFromObject(s),t=new C;e.getSize(t);const i=1/Math.max(t.x,t.y,t.z,.001);s.scale.setScalar(i),s.rotation.x=Math.PI/2;const r=new wn;return r.add(s),s.position.z=-e.min.y*i,r}function sx(s){if(is.has(s))return Promise.resolve(is.get(s));if(Jo.has(s))return Jo.get(s);const e=Bn(s);if(!(e!=null&&e.fbxPath)){const n=ga(e);return is.set(s,n),Promise.resolve(n)}const t=new Promise(n=>{nx.load(e.fbxPath,i=>{const r=ix(i);is.set(s,r),n(r)},void 0,()=>{const i=ga(e);is.set(s,i),n(i)})});return Jo.set(s,t),t}function ea(s){const e=Bn(s),t=is.get(s);if(t){const i=t.clone(!0);return i.userData.fromPropCache=!0,i.traverse(r=>{r.isMesh&&r.material&&(r.material=r.material.clone())}),i}const n=ga(e);return n.userData.fromPropCache=!1,n}const rx=9139029;function Tu(s){const e=yn(s),t=e.width,n=e.height;return{tx:Math.floor(s.chunkX+t/2),ty:Math.floor(s.chunkY+n/2)}}function _a(s,e,t,n,i,r,o,a){const l=i.length-1;function c(x,v){var U;if(x<0||x>=o||v<0||v>=a)return!1;const M=Math.floor(l/o),y=Math.min(l,Math.floor((x+.5)*M)),b=Math.min(l,Math.floor((v+.5)*M));return(((U=i[b])==null?void 0:U[y])??0)>r}const h=(x,v)=>`${x},${v}`,u=new Map,d=new Set,p=new Map,g=new Map,_=new Map,m=h(s,e);p.set(m,0),g.set(m,Math.abs(t-s)+Math.abs(n-e)),u.set(m,{tx:s,ty:e,f:g.get(m)});const f=[[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,-1],[-1,1]];for(;u.size>0;){let x=null,v=1/0;for(const[y,b]of u)b.f<v&&(v=b.f,x=y);if(x===null)break;const M=u.get(x);if(u.delete(x),d.add(x),M.tx===t&&M.ty===n){const y=[];let b=x;for(;b;){const[w,U]=b.split(",").map(Number);y.unshift({tx:w,ty:U}),b=_.get(b)}return y}for(const[y,b]of f){const w=M.tx+y,U=M.ty+b,S=h(w,U);if(d.has(S)||!c(w,U))continue;const E=y!==0&&b!==0?1.414:1,L=(p.get(x)??1/0)+E;if(L>=(p.get(S)??1/0))continue;_.set(S,x),p.set(S,L);const F=Math.abs(t-w)+Math.abs(n-U);g.set(S,L+F),u.set(S,{tx:w,ty:U,f:L+F})}}return null}function ih(s,e,t,n){if(!s||e<=1)return s;let i=new Set(s);const r=[[0,1],[1,0],[0,-1],[-1,0]];for(let o=0;o<e-1;o++){const a=new Set(i);for(const l of i){const[c,h]=l.split(",").map(Number);for(const[u,d]of r){const p=c+u,g=h+d;p>=0&&p<t&&g>=0&&g<n&&a.add(`${p},${g}`)}}i=a}return i}function ox(s,e,t){const n=new Set;if(!e||!s||s.length<2)return n;const i=e.length-1,r=(t==null?void 0:t.tileSize)??(t==null?void 0:t.chunkSize)??8,o=(t==null?void 0:t.tilesX)??Math.floor(i/r),a=(t==null?void 0:t.tilesY)??Math.floor(i/r),l=(t==null?void 0:t.seaLevel)??.12,c=Math.max(1,Math.min(5,parseInt(t==null?void 0:t.pathWidth,10)||1)),h=s.map(_=>Tu(_)),u=h.length;for(const _ of h)n.add(`${_.tx},${_.ty}`);if(u<2)return ih(n,c,o,a);const d=[];for(let _=0;_<u;_++)for(let m=_+1;m<u;m++){const f=_a(h[_].tx,h[_].ty,h[m].tx,h[m].ty,e,l,o,a);f&&f.length>0&&d.push({i:_,j:m,path:f,len:f.length})}const p=new Set([0]),g=[];for(;p.size<u;){let _=null;for(const m of d){const f=p.has(m.i),x=p.has(m.j);f!==x&&(_===null||m.len<_.len)&&(_=m)}if(_===null)break;g.push(_),p.add(_.i),p.add(_.j)}for(let _=1;_<u;_++){if(p.has(_))continue;const m=_a(h[0].tx,h[0].ty,h[_].tx,h[_].ty,e,l,o,a);m&&(g.push({i:0,j:_,path:m,len:m.length}),p.add(_))}for(const _ of g)for(const{tx:m,ty:f}of _.path)n.add(`${m},${f}`);return ih(n,c,o,a)}function ax(s,e,t){var o;if(!s||!e||e.size===0)return;const n=s.length-1,i=(t==null?void 0:t.tileSize)??(t==null?void 0:t.chunkSize)??8;(t==null?void 0:t.tilesX)??Math.floor(n/i),(t==null?void 0:t.tilesY)??Math.floor(n/i);const r=[];for(const a of e){const[l,c]=a.split(",").map(Number),h=Math.max(0,l*i),u=Math.max(0,c*i),d=Math.min(n,(l+1)*i),p=Math.min(n,(c+1)*i);let g=0,_=0;for(let m=u;m<=p;m++)for(let f=h;f<=d;f++)g+=((o=s[m])==null?void 0:o[f])??0,_++;if(_>0){const m=g/_;r.push({x0:h,y0:u,x1:d,y1:p,avg:m})}}for(const{x0:a,y0:l,x1:c,y1:h,avg:u}of r)for(let d=l;d<=h;d++)for(let p=a;p<=c;p++)s[d]&&(s[d][p]=u)}function sh(s,e,t,n,i,r){if(!n||n.length===0||!i||i.length<2)return!0;const o=i.length-1,a=(r==null?void 0:r.tileSize)??(r==null?void 0:r.chunkSize)??8,l=(r==null?void 0:r.tilesX)??Math.floor(o/a),c=(r==null?void 0:r.tilesY)??Math.floor(o/a),h=(r==null?void 0:r.seaLevel)??.12,u=$n(s),d=Math.floor(e+u.width/2),p=Math.floor(t+u.height/2);for(const g of n){const _=Tu(g),m=_a(d,p,_.tx,_.ty,i,h,l,c);if(m&&m.length>0)return!0}return!1}function Di(s,e,t){const n=e?e.map(r=>[...r]):null;if(!n)return{pathTiles:new Set,heightMap:n};const i=ox(s,n,t);return ax(n,i,t),{pathTiles:i,heightMap:n}}const Cs={water:3900150,beach:16708551,grass:4881497,rock:7041664,snow:15792639};function rh(s,e){if(s<=e)return Cs.water;const t=(s-e)/(1.2-e);return t<.12?Cs.beach:t<.4?Cs.grass:t<.7?Cs.rock:Cs.snow}function oh(s){return[(s>>16&255)/255,(s>>8&255)/255,(s&255)/255]}class lx{constructor(e){this.container=e,this.scene=null,this.camera=null,this.renderer=null,this.controls=null,this.islandMesh=null,this.waterMesh=null,this.hoverOverlayMesh=null,this.buildingMeshes=[],this.gridOverlayMesh=null,this.zoneHintsOverlayMesh=null,this.placementPreviewMesh=null,this.buildingHighlightMesh=null,this.propMeshes=[],this.propPlacementPreviewMesh=null,this.propHighlightMesh=null,this._lastHighlightedProp=null,this.rampPreviewMesh=null,this._inputMode="view",this._spaceHeld=!1,this.ambientLight=null,this.directionalLight=null,this.config={waterColor:2450411,wireframe:!1,showWater:!0,heightScale:1,useVertexColors:!0,seaLevel:.12,pathColor:rx,shadows:!0,antialias:!0},this.pathTiles=new Set,this._onPropMeshLoaded=null,this.transformControls=null,this._onPropTransformChange=null,this._gizmoTileConfig=null,this._gizmoHeightMap=null,this._gizmoSnapEnabled=!1,this._gizmoBaseSize=.8,this._gizmoRefDistance=1.5,this._gizmoPos=new C,this._frameCount=0,this._gizmoSizeUpdateInterval=10}setOnPropMeshLoaded(e){this._onPropMeshLoaded=e}setOnPropTransformChange(e){this._onPropTransformChange=e}init(){const e=this.container.clientWidth,t=this.container.clientHeight;this.scene=new p_,this.scene.background=new He(8900331),this.camera=new qt(55,e/t,.1,1e3),this.camera.position.set(1.5,1.2,1.5),this.camera.lookAt(0,0,0),this.camera.layers.enable(1),this.renderer=new su({antialias:this.config.antialias!==!1,powerPreference:"high-performance"}),this.renderer.setSize(e,t),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=this.config.shadows!==!1,this.renderer.shadowMap.type=qu,this.container.appendChild(this.renderer.domElement),this.controls=new fv(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,this.controls.minDistance=.5,this.controls.maxDistance=8,this.ambientLight=new uu(16777215,.55),this.scene.add(this.ambientLight),this.directionalLight=new hu(16777215,.85),this.directionalLight.position.set(2,4,2),this.directionalLight.castShadow=this.config.shadows!==!1,this.directionalLight.shadow.mapSize.width=512,this.directionalLight.shadow.mapSize.height=512;const n=this.directionalLight.shadow.camera;n.left=n.bottom=-1.2,n.right=n.top=1.2,n.near=.1,n.far=8,this.scene.add(this.directionalLight),this.transformControls=new pv(this.camera,this.renderer.domElement),this.transformControls.setMode("translate"),this.transformControls.setSpace("world"),this.transformControls.setSize(this._gizmoBaseSize),this.transformControls.layers.enableAll(),this.transformControls.addEventListener("dragging-changed",i=>{this.controls.enabled=!i.value}),this.transformControls.addEventListener("objectChange",()=>this._onGizmoObjectChange()),window.addEventListener("resize",()=>this.onResize())}getPropMeshForProp(e){var t;for(const n of this.propMeshes)if(((t=n.userData)==null?void 0:t.prop)===e)return n;return null}setPropGizmoAttached(e,t,n){if(this.detachPropGizmo(),!e||!this.transformControls)return;const i=this.getPropMeshForProp(e);i&&(this._gizmoTileConfig=t,this._gizmoHeightMap=n,this.transformControls.attach(i),this._applyGizmoSnap(),this.transformControls.parent||this.scene.add(this.transformControls))}detachPropGizmo(){this.transformControls&&(this.transformControls.detach(),this.transformControls.parent&&this.scene.remove(this.transformControls)),this._gizmoTileConfig=null,this._gizmoHeightMap=null}setGizmoMode(e){this.transformControls&&this.transformControls.setMode(e)}setGizmoSpace(e){this.transformControls&&this.transformControls.setSpace(e)}setGizmoSnap(e){this._gizmoSnapEnabled=!!e,this._applyGizmoSnap()}isGizmoSnapEnabled(){return this._gizmoSnapEnabled}_applyGizmoSnap(){if(!this.transformControls)return;if(!this._gizmoSnapEnabled){this.transformControls.translationSnap=null,this.transformControls.rotationSnap=null,this.transformControls.scaleSnap=null;return}const e=this._gizmoTileConfig,t=(e==null?void 0:e.tilesX)??8,n=(e==null?void 0:e.tilesY)??t,i=Math.min(1/t,1/n);this.transformControls.translationSnap=i,this.transformControls.rotationSnap=Math.PI/12,this.transformControls.scaleSnap=.1}_onGizmoObjectChange(){var L,F,z,D,O;const e=(L=this.transformControls)==null?void 0:L.object;if(!e||!((F=e.userData)!=null&&F.prop)||!this._gizmoTileConfig||!this._gizmoHeightMap)return;const t=e.userData.prop,{tileSize:n,tilesX:i,tilesY:r}=this._gizmoTileConfig,o=i??1,a=r??1,l=this._gizmoHeightMap.length-1,c=e.position,h=(c.x+.5)*o,u=(.5-c.y)*a,d=Math.max(0,Math.min(i-1,Math.floor(h-.5))),p=Math.max(0,Math.min(r-1,Math.floor(u-.5))),g=h-d-.5,_=u-p-.5,m=(-e.rotation.z*180/Math.PI+360)%360,f=Bn(t.type);f==null||f.defaultScale;const x=1/o,v=e.scale.x/x,M=Math.max(.25,Math.min(100,v)),y=n??8,b=Math.min(l,Math.max(0,Math.floor((d+.5)*y))),w=Math.min(l,Math.max(0,Math.floor((p+.5)*y))),U=(((z=this._gizmoHeightMap[w])==null?void 0:z[b])??0)*this.config.heightScale+.02,S=Math.max(-.5,Math.min(.5,(e.position.z-U-.01)/this.config.heightScale)),E={chunkX:d,chunkY:p,offsetX:g,offsetY:_,offsetZ:S,rotation:m,scale:M};Object.assign(t,E),e.position.z=U+.01+S*this.config.heightScale,(D=this._onPropTransformChange)==null||D.call(this,t,E),(O=this.renderer)==null||O.render(this.scene,this.camera)}onResize(){const e=this.container.clientWidth,t=this.container.clientHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)}render(e){var g;if(!(e!=null&&e.heightMap))return;this.hoverOverlayMesh&&(this.islandMesh&&this.islandMesh.remove(this.hoverOverlayMesh),this.hoverOverlayMesh.geometry.dispose(),this.hoverOverlayMesh.material.dispose(),this.hoverOverlayMesh=null),this._clearRampPreview(),this._clearContourOverlay(),this._clearBuildings(),this._clearGridOverlay(),this.islandMesh&&(this.scene.remove(this.islandMesh),this.islandMesh.geometry.dispose(),this.islandMesh.material.dispose()),this.waterMesh&&(this.scene.remove(this.waterMesh),this.waterMesh.geometry.dispose(),this.waterMesh.material.dispose());const{heightMap:t,config:n}=e;this.pathTiles=e.pathTiles?new Set(e.pathTiles):new Set;const i=(n==null?void 0:n.gridSize)??t.length-1,r=(n==null?void 0:n.seaLevel)??this.config.seaLevel;this.config.seaLevel=r;const o=(n==null?void 0:n.tileSize)??(n==null?void 0:n.chunkSize)??8;(n==null?void 0:n.tilesX)??Math.floor(i/o);const a=1,l=i,c=new Kn(a,a,l,l),h=c.attributes.position,u=h.count,d=new Float32Array(u*3);for(let _=0;_<u;_++){const m=Math.floor(_%(l+1)),f=Math.floor(_/(l+1)),x=((g=t[f])==null?void 0:g[m])??0;h.setZ(_,x*this.config.heightScale);const v=Math.floor(m/o),M=Math.floor(f/o),y=`${v},${M}`,b=this.pathTiles.has(y)?this.config.pathColor:rh(x,r),[w,U,S]=oh(b);d[_*3]=w,d[_*3+1]=U,d[_*3+2]=S}c.setAttribute("color",new Mn(d,3)),c.computeVertexNormals();const p=new Fs({vertexColors:this.config.useVertexColors,flatShading:!1,wireframe:this.config.wireframe});if(this.islandMesh=new ce(c,p),this.islandMesh.rotation.x=-Math.PI/2,this.islandMesh.receiveShadow=!0,this.islandMesh.castShadow=!0,this.scene.add(this.islandMesh),this.config.showWater){const _=new Kn(a*1.5,a*1.5,1,1),m=new Fs({color:this.config.waterColor,transparent:!0,opacity:.75});this.waterMesh=new ce(_,m),this.waterMesh.rotation.x=-Math.PI/2,this.waterMesh.position.y=-.02,this.scene.add(this.waterMesh)}}setHoverOverlay(e,t){var v,M;if(this.hoverOverlayMesh&&((v=this.islandMesh)==null||v.remove(this.hoverOverlayMesh),this.hoverOverlayMesh.geometry.dispose(),this.hoverOverlayMesh.material.dispose(),this.hoverOverlayMesh=null),!e||!t||!this.islandMesh)return;const{x0:n,y0:i,x1:r,y1:o}=e,a=t.length-1,l=Math.max(1,r-n),c=Math.max(1,o-i),h=Math.min(l,a),u=Math.min(c,a),d=(r-n)/a,p=(o-i)/a,g=new Kn(d,p,h,u),_=g.attributes.position;for(let y=0;y<_.count;y++){const b=Math.min(a,n+y%(h+1)),w=Math.min(a,i+Math.floor(y/(h+1))),U=((M=t[w])==null?void 0:M[b])??0;_.setZ(y,U*this.config.heightScale+.012)}g.computeVertexNormals();const m=new Fn({color:16707722,transparent:!0,opacity:.5,depthTest:!0,depthWrite:!1});this.hoverOverlayMesh=new ce(g,m),this.hoverOverlayMesh.layers.set(1);const f=(n+r)/(2*a)-.5,x=.5-(i+o)/(2*a);this.hoverOverlayMesh.position.set(f,x,0),this.islandMesh.add(this.hoverOverlayMesh)}_clearBuildings(){var e,t;for(const n of this.buildingMeshes)n.parent&&n.parent.remove(n),(e=n.geometry)==null||e.dispose(),(t=n.material)==null||t.dispose();this.buildingMeshes=[]}_clearGridOverlay(){this.gridOverlayMesh&&(this.gridOverlayMesh.parent&&this.gridOverlayMesh.parent.remove(this.gridOverlayMesh),this.gridOverlayMesh.geometry.dispose(),this.gridOverlayMesh.material.dispose(),this.gridOverlayMesh=null)}_clearPlacementPreview(){var e,t;this.placementPreviewMesh&&this.islandMesh&&(this.islandMesh.remove(this.placementPreviewMesh),(e=this.placementPreviewMesh.geometry)==null||e.dispose(),(t=this.placementPreviewMesh.material)==null||t.dispose(),this.placementPreviewMesh=null)}_clearBuildingHighlight(){var e,t;this.buildingHighlightMesh&&this.islandMesh&&(this.islandMesh.remove(this.buildingHighlightMesh),(e=this.buildingHighlightMesh.geometry)==null||e.dispose(),(t=this.buildingHighlightMesh.material)==null||t.dispose(),this.buildingHighlightMesh=null)}_clearRampPreview(){var e,t;this.rampPreviewMesh&&this.islandMesh&&(this.islandMesh.remove(this.rampPreviewMesh),(e=this.rampPreviewMesh.geometry)==null||e.dispose(),(t=this.rampPreviewMesh.material)==null||t.dispose(),this.rampPreviewMesh=null)}setRampPreview(e,t,n){if(this._clearRampPreview(),!e||!t||!this.islandMesh||n<=0)return;const i=1/n,r=e.gx*i-.5,o=.5-e.gy*i,a=(e.h??0)*this.config.heightScale+.01,l=t.gx*i-.5,c=.5-t.gy*i,h=(t.h??0)*this.config.heightScale+.01,u=new yt().setFromPoints([new C(r,o,a),new C(l,c,h)]),d=new jn({color:16498468,linewidth:2});this.rampPreviewMesh=new _n(u,d),this.rampPreviewMesh.layers.set(1),this.islandMesh.add(this.rampPreviewMesh)}_clearContourOverlay(){var e,t;this.contourOverlayMesh&&this.islandMesh&&(this.islandMesh.remove(this.contourOverlayMesh),(e=this.contourOverlayMesh.geometry)==null||e.dispose(),(t=this.contourOverlayMesh.material)==null||t.dispose(),this.contourOverlayMesh=null)}setContourOverlay(e,t,n=.1){var h,u,d,p;if(this._clearContourOverlay(),!e||!t||!this.islandMesh||n<=0)return;const i=t.length-1;if(i<=0)return;const r=1/i,o=[],a=(g,_,m,f,x,v)=>{o.push(g,_,m,f,x,v)};for(let g=n;g<1;g+=n)for(let _=0;_<i;_++)for(let m=0;m<i;m++){const f=((h=t[_])==null?void 0:h[m])??0,x=((u=t[_])==null?void 0:u[m+1])??0,v=((d=t[_+1])==null?void 0:d[m])??0,M=((p=t[_+1])==null?void 0:p[m+1])??0,y=(w,U)=>w<=g&&g<=U||U<=g&&g<=w,b=[];if(y(f,x)){const w=(g-f)/(x-f||1e-9);b.push([(m+w)*r-.5,.5-_*r,g*this.config.heightScale+.005])}if(y(x,M)){const w=(g-x)/(M-x||1e-9);b.push([(m+1)*r-.5,.5-(_+w)*r,g*this.config.heightScale+.005])}if(y(M,v)){const w=(g-M)/(v-M||1e-9);b.push([(m+1-w)*r-.5,.5-(_+1)*r,g*this.config.heightScale+.005])}if(y(v,f)){const w=(g-v)/(f-v||1e-9);b.push([m*r-.5,.5-(_+1-w)*r,g*this.config.heightScale+.005])}b.length>=2&&a(b[0][0],b[0][1],b[0][2],b[1][0],b[1][1],b[1][2])}if(o.length<6)return;const l=new yt;l.setAttribute("position",new nt(o,3)),l.setDrawRange(0,o.length/3);const c=new jn({color:959977,transparent:!0,opacity:.6});this.contourOverlayMesh=new br(l,c),this.contourOverlayMesh.layers.set(1),this.islandMesh.add(this.contourOverlayMesh)}setPlacementPreview(e,t,n,i,r,o,a,l,c=!0){var S;if(this._clearPlacementPreview(),e==null||t==null||!this.islandMesh||!r)return;const h=sn(n);if(!h)return;const u=$n(n),d=u.width,p=u.height,g=r.length-1,_=o||8,m=a??Math.floor(g/_),f=l??Math.floor(g/_),x=(e+d/2)/m-.5,v=.5-(t+p/2)/f,M=Math.min(g,Math.floor((e+d/2)*_)),y=Math.min(g,Math.floor((t+p/2)*_)),b=(((S=r[y])==null?void 0:S[M])??0)*this.config.heightScale+.02,w=d*_/g,U=p*_/g;if(i){const E=Math.max(b*.5,.08),L=new ht(w,U,E),F=c?h.color:16096779,z=new Fn({color:F,transparent:!0,opacity:.6,depthTest:!0,depthWrite:!1,side:en});this.placementPreviewMesh=new ce(L,z),this.placementPreviewMesh.position.set(x,v,b+E*.5+.015),this.placementPreviewMesh.layers.set(1),this.islandMesh.add(this.placementPreviewMesh)}else{const E=new Kn(w,U),L=new Fn({color:15680580,transparent:!0,opacity:.5,depthTest:!0,depthWrite:!1,side:en});this.placementPreviewMesh=new ce(E,L),this.placementPreviewMesh.position.set(x,v,b+.02),this.placementPreviewMesh.layers.set(1),this.islandMesh.add(this.placementPreviewMesh)}}setBuildingHighlight(e,t,n,i,r){var F;if(this._clearBuildingHighlight(),!e||!this.islandMesh||!t||!sn(e.type))return;const a=yn(e),l=a.width,c=a.height,h=t.length-1,u=n||8,d=i??Math.floor(h/u),p=r??Math.floor(h/u),g=e.chunkX??0,_=e.chunkY??0,m=(e.rotation??0)*(Math.PI/180),f=(g+l/2)/d-.5,x=.5-(_+c/2)/p,v=Math.min(h,Math.floor((g+l/2)*u)),M=Math.min(h,Math.floor((_+c/2)*u)),y=(((F=t[M])==null?void 0:F[v])??0)*this.config.heightScale+.02,b=l*u/h,w=c*u/h,U=Math.max(y*.5,.08),S=new ht(b,w,U+.02),E=new Dc(S);S.dispose();const L=new jn({color:16498468,linewidth:2});this.buildingHighlightMesh=new br(E,L),this.buildingHighlightMesh.position.set(f,x,y+U*.5),this.buildingHighlightMesh.rotation.z=-m,this.buildingHighlightMesh.layers.set(1),this.islandMesh.add(this.buildingHighlightMesh)}clearPlacementPreview(){this._clearPlacementPreview()}clearBuildingHighlight(){this._clearBuildingHighlight()}_clearProps(){var e,t;for(const n of this.propMeshes)n.parent&&n.parent.remove(n),(e=n.geometry)==null||e.dispose(),(t=n.material)==null||t.dispose();this.propMeshes=[]}_clearPropPlacementPreview(){this.propPlacementPreviewMesh&&this.islandMesh&&(this.islandMesh.remove(this.propPlacementPreviewMesh),this.propPlacementPreviewMesh.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}),this.propPlacementPreviewMesh=null)}_clearPropHighlight(){this.propHighlightMesh&&this.islandMesh&&(this.islandMesh.remove(this.propHighlightMesh),this.propHighlightMesh.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}),this.propHighlightMesh=null),this._lastHighlightedProp=null}_createPropPlaceholderGeometry(e,t=.08){switch(e){case"sphere":return new Ai(t,8,6);case"cylinder":return new bt(t*.4,t*.5,t*1.5,8);case"cone":return new Qr(t*.6,t*1.2,8);case"box":return new ht(t*.4,t*1.2,t*.2);case"signpost":return new bt(t*.15,t*.2,t*1.2,8);default:return new Ai(t,8,6)}}renderProps(e,t,n,i,r,o={}){var d,p;if(this.detachPropGizmo(),this._clearProps(),!this.islandMesh||!t||!Array.isArray(e))return;const a=t.length-1,l=n||8,c=i??Math.floor(a/l),h=r??Math.floor(a/l),u=new Set;for(const g of e){const _=Bn(g.type);if(!_)continue;const m=g.chunkX??0,f=g.chunkY??0,x=(g.rotation??0)*(Math.PI/180),v=(g.offsetX??0)/c,M=(g.offsetY??0)/h,y=(g.offsetZ??0)*this.config.heightScale,b=(m+.5)/c-.5+v,w=.5-(f+.5)/h-M,U=Math.min(a,Math.floor((m+.5)*l)),S=Math.min(a,Math.floor((f+.5)*l)),E=(((d=t[S])==null?void 0:d[U])??0)*this.config.heightScale+.02,L=ea(g.type);_!=null&&_.fbxPath&&!((p=L.userData)!=null&&p.fromPropCache)&&u.add(g.type);const F=_.defaultScale??1,D=1/c*(g.scale??F);L.scale.setScalar(D),L.position.set(b,w,E+.01+y),L.rotation.z=-x,L.traverse(O=>{O.isMesh&&(O.castShadow=!0,O.receiveShadow=!0)}),L.userData.prop=g,this.islandMesh.add(L),this.propMeshes.push(L)}for(const g of u)sx(g).then(()=>{var _;(_=o.onMeshLoaded||this._onPropMeshLoaded)==null||_()})}setPropPlacementPreview(e,t,n,i,r,o,a,l){var w;if(this._clearPropPlacementPreview(),e==null||t==null||!this.islandMesh||!r)return;const c=Bn(n);if(!c)return;const h=r.length-1,u=o||8,d=a??Math.floor(h/u),p=l??Math.floor(h/u),g=(e+.5)/d-.5,_=.5-(t+.5)/p,m=Math.min(h,Math.floor((e+.5)*u)),f=Math.min(h,Math.floor((t+.5)*u)),x=(((w=r[f])==null?void 0:w[m])??0)*this.config.heightScale+.02,v=c.defaultScale??1,y=1/d*v,b=ea(n);b.scale.setScalar(y),b.position.set(g,_,x+.01),b.rotation.z=0,b.traverse(U=>{U.isMesh&&U.material&&(U.material=new Fn({color:i?c.color:15680580,transparent:!0,opacity:i?.6:.5,depthTest:!0,depthWrite:!1}))}),this.propPlacementPreviewMesh=b,this.propPlacementPreviewMesh.layers.set(1),this.islandMesh.add(this.propPlacementPreviewMesh)}setPropHighlight(e,t,n,i,r){var L;if(e===this._lastHighlightedProp||(this._lastHighlightedProp=e,this._clearPropHighlight(),!e||!this.islandMesh||!t))return;const o=Bn(e.type);if(!o)return;const a=t.length-1,l=n||8,c=i??Math.floor(a/l),h=r??Math.floor(a/l),u=e.chunkX??0,d=e.chunkY??0,p=(e.rotation??0)*(Math.PI/180),g=(e.offsetX??0)/c,_=(e.offsetY??0)/h,m=(e.offsetZ??0)*this.config.heightScale,f=(u+.5)/c-.5+g,x=.5-(d+.5)/h-_,v=Math.min(a,Math.floor((u+.5)*l)),M=Math.min(a,Math.floor((d+.5)*l)),y=(((L=t[M])==null?void 0:L[v])??0)*this.config.heightScale+.02,b=o.defaultScale??1,U=1/c*(e.scale??b),S=ea(e.type);S.scale.setScalar(U),S.position.set(f,x,y+.01+m),S.rotation.z=-p,this.islandMesh.add(S),S.updateMatrixWorld(!0);const E=new wn;S.traverse(F=>{if(F.isMesh&&F.geometry){const z=new Dc(F.geometry),D=new br(z,new jn({color:16498468}));D.matrix.copy(F.matrixWorld),D.matrixAutoUpdate=!1,E.add(D)}}),this.islandMesh.remove(S),this.propHighlightMesh=E,this.propHighlightMesh.layers.set(1),this.islandMesh.add(this.propHighlightMesh),this._lastHighlightedProp=e}clearPropPlacementPreview(){this._clearPropPlacementPreview()}clearPropHighlight(){this._clearPropHighlight()}pickPropAt(e){var n,i;if(!this.camera||!((n=this.propMeshes)!=null&&n.length))return null;this._pickRaycaster||(this._pickRaycaster=new Zs),this._pickRaycaster.setFromCamera(e,this.camera),this._pickRaycaster.layers.set(0);const t=this._pickRaycaster.intersectObjects(this.propMeshes,!0);for(const r of t){let o=r.object;for(;o;){if((i=o.userData)!=null&&i.prop)return o.userData.prop;o=o.parent}}return null}renderBuildings(e,t,n,i,r){var h;if(this._clearBuildings(),!this.islandMesh||!t||!Array.isArray(e))return;const o=t.length-1,a=n||8,l=i??Math.floor(o/a),c=r??Math.floor(o/a);for(const u of e){const d=sn(u.type);if(!d)continue;const p=yn(u),g=p.width,_=p.height,m=u.chunkX??0,f=u.chunkY??0,x=(u.rotation??0)*(Math.PI/180),v=(m+g/2)/l-.5,M=.5-(f+_/2)/c,y=Math.min(o,Math.floor((m+g/2)*a)),b=Math.min(o,Math.floor((f+_/2)*a)),w=(((h=t[b])==null?void 0:h[y])??0)*this.config.heightScale+.02,U=g*a/o,S=_*a/o,E=Math.max(w*.5,.08),L=new ht(U,S,E),F=new Fs({color:d.color}),z=new ce(L,F);z.position.set(v,M,w+E*.5),z.rotation.z=-x,z.castShadow=!0,z.receiveShadow=!0,this.islandMesh.add(z),this.buildingMeshes.push(z)}}setTileGridOverlay(e,t,n,i){if(this._clearGridOverlay(),!e||!this.islandMesh||t<=0||n<=0)return;const r=[];for(let l=0;l<=t;l++){const c=l/t-.5;r.push(c,-.5,.01,c,.5,.01)}for(let l=0;l<=n;l++){const c=l/n-.5;r.push(-.5,c,.01,.5,c,.01)}const o=new yt;o.setAttribute("position",new nt(r,3)),o.setDrawRange(0,r.length/3);const a=new jn({color:959977,transparent:!0,opacity:.4});this.gridOverlayMesh=new br(o,a),this.gridOverlayMesh.layers.set(1),this.islandMesh.add(this.gridOverlayMesh)}setZoneHintsOverlay(e,t,n,i,r,o){var p;if(this.zoneHintsOverlayMesh&&(this.zoneHintsOverlayMesh.parent&&this.zoneHintsOverlayMesh.parent.remove(this.zoneHintsOverlayMesh),this.zoneHintsOverlayMesh.geometry.dispose(),this.zoneHintsOverlayMesh.material.dispose(),this.zoneHintsOverlayMesh=null),!e||!this.islandMesh||!t||t.size===0||!n)return;const a=n.length-1,l=[],c=[];let h=0;for(const g of t){const[_,m]=g.split(",").map(Number),f=_/r-.5,x=.5-(m+1)/o,v=(_+1)/r-.5,M=.5-m/o,y=Math.min(a,Math.floor((_+.5)*ts)),b=Math.min(a,Math.floor((m+.5)*ts)),w=(((p=n[b])==null?void 0:p[y])??0)*this.config.heightScale+.02;l.push(f,x,w,v,x,w,v,M,w,f,M,w),c.push(h,h+1,h+2,h,h+2,h+3),h+=4}if(l.length===0)return;const u=new yt;u.setAttribute("position",new nt(l,3)),u.setIndex(c);const d=new Fn({color:2278750,transparent:!0,opacity:.25,depthTest:!0,depthWrite:!1,side:en});this.zoneHintsOverlayMesh=new ce(u,d),this.zoneHintsOverlayMesh.layers.set(1),this.islandMesh.add(this.zoneHintsOverlayMesh)}updateFromHeightMap(e,t,n){var c;if(!this.islandMesh||!e)return;t!=null&&(this.pathTiles=t instanceof Set?t:new Set(t));const i=this.islandMesh.geometry.attributes.position,r=this.islandMesh.geometry.attributes.color,o=Math.sqrt(i.count)-1,a=this.config.seaLevel,l=n??Math.max(1,Math.floor(o/16));for(let h=0;h<i.count;h++){const u=Math.floor(h%(o+1)),d=Math.floor(h/(o+1)),p=((c=e[d])==null?void 0:c[u])??0;i.setZ(h,p*this.config.heightScale);const g=Math.floor(u/l),_=Math.floor(d/l),m=`${g},${_}`,f=this.pathTiles.has(m)?this.config.pathColor:rh(p,a),[x,v,M]=oh(f);r.setXYZ(h,x,v,M)}i.needsUpdate=!0,r.needsUpdate=!0,this.islandMesh.geometry.computeVertexNormals()}setConfig(e){Object.assign(this.config,e),this.directionalLight&&"shadows"in e&&(this.directionalLight.castShadow=this.config.shadows!==!1),this.renderer&&"shadows"in e&&(this.renderer.shadowMap.enabled=this.config.shadows!==!1)}getMesh(){return this.islandMesh}getScene(){return this.scene}getCamera(){return this.camera}getRenderer(){return this.renderer}getControls(){return this.controls}setInputMode(e){this.controls&&(this._inputMode=e,this._spaceHeld=!1,this._removeSpaceListeners(),e==="edit"?(this._applyEditMouseButtons(),this._spaceKeyDown=t=>{var n,i;t.code==="Space"&&!t.repeat&&!((i=(n=document.activeElement)==null?void 0:n.closest)!=null&&i.call(n,"input, textarea, select"))&&(t.preventDefault(),this._spaceHeld=!0,this._applyEditMouseButtons())},this._spaceKeyUp=t=>{t.code==="Space"&&!t.repeat&&this._spaceHeld&&(t.preventDefault(),this._spaceHeld=!1,this._applyEditMouseButtons())},window.addEventListener("keydown",this._spaceKeyDown),window.addEventListener("keyup",this._spaceKeyUp)):(this.controls.mouseButtons.LEFT=Jt.ROTATE,this.controls.mouseButtons.MIDDLE=Jt.DOLLY,this.controls.mouseButtons.RIGHT=Jt.PAN))}_applyEditMouseButtons(){this.controls&&(this._spaceHeld?(this.controls.mouseButtons.LEFT=Jt.ROTATE,this.controls.mouseButtons.RIGHT=Jt.PAN):(this.controls.mouseButtons.LEFT=null,this.controls.mouseButtons.RIGHT=Jt.ROTATE),this.controls.mouseButtons.MIDDLE=Jt.DOLLY)}isSpaceHeld(){return this._spaceHeld===!0}_removeSpaceListeners(){this._spaceKeyDown&&(window.removeEventListener("keydown",this._spaceKeyDown),window.removeEventListener("keyup",this._spaceKeyUp),this._spaceKeyDown=null,this._spaceKeyUp=null)}animate(){var t,n,i;requestAnimationFrame(()=>this.animate()),(t=this.controls)==null||t.update(),this._frameCount++;const e=(n=this.transformControls)==null?void 0:n.object;if(e&&this.camera&&this._frameCount%this._gizmoSizeUpdateInterval===0){e.getWorldPosition(this._gizmoPos);const r=this.camera.position.distanceTo(this._gizmoPos),o=this._gizmoBaseSize*(r/this._gizmoRefDistance);this.transformControls.setSize(Math.max(.3,Math.min(1.5,o)))}(i=this.renderer)==null||i.render(this.scene,this.camera)}}const cx={sea:.12,beach:.2,grass:.35,rock:.55,snow:.75};class hx{constructor(e){this.visualizer=e,this.raycaster=new Zs,this.mouse=new Le,this.isEditing=!1,this.brushMode="raise",this.brushSizeInTiles=1,this.brushStrength=.02,this.brushTargetHeight=.35,this.heightMap=null,this.gridSize=0,this.tileSize=8,this.tilesX=0,this.tilesY=0,this.seaLevel=.12,this._boundHandleMouse=this._handleMouse.bind(this),this.onHeightAtCursor=null,this.onBeforeBrush=null,this.onAfterBrush=null,this.onHoverTile=null,this.applyOnClickOnly=!1,this.canPaint=null,this.elevMin=0,this.elevMax=1,this.rampPointA=null,this.onRampPreview=null}setElevationClamp(e,t){this.elevMin=e!=null?Math.max(0,Math.min(1,e)):0,this.elevMax=t!=null?Math.max(0,Math.min(1,t)):1}setHeightMap(e){this.heightMap=e?e.map(t=>[...t]):null,this.gridSize=this.heightMap?this.heightMap.length-1:0}setTileConfig(e,t,n){this.tileSize=e||8,this.tilesX=t||Math.floor(this.gridSize/this.tileSize),this.tilesY=n||Math.floor(this.gridSize/this.tileSize)}getHeightMap(){return this.heightMap}setBrushSizeInTiles(e){this.brushSizeInTiles=Math.max(1,Math.min(5,e))}setBrushStrength(e){this.brushStrength=Math.max(.001,Math.min(.2,e))}setBrushMode(e){this.brushMode=e,e!=="ramp"&&(this.rampPointA=null)}setBrushTargetHeight(e){this.brushTargetHeight=Math.max(0,Math.min(1,e))}setSeaLevel(e){this.seaLevel=e}setApplyOnClickOnly(e){this.applyOnClickOnly=!!e}setCanPaint(e){this.canPaint=typeof e=="function"?e:null}enable(e){this.domElement=e,e.addEventListener("mousedown",this._boundHandleMouse),e.addEventListener("mousemove",this._boundHandleMouse),e.addEventListener("mouseup",this._boundHandleMouse),e.addEventListener("mouseleave",this._boundHandleMouse),this.isEditing=!0}disable(){this.domElement&&(this.domElement.removeEventListener("mousedown",this._boundHandleMouse),this.domElement.removeEventListener("mousemove",this._boundHandleMouse),this.domElement.removeEventListener("mouseup",this._boundHandleMouse),this.domElement.removeEventListener("mouseleave",this._boundHandleMouse)),this.isEditing=!1,this.onHeightAtCursor&&this.onHeightAtCursor(null),this.onHoverTile&&this.onHoverTile(null)}_handleMouse(e){if(!this.heightMap||!this.visualizer.getMesh())return;const t=this.domElement.getBoundingClientRect();if(this.mouse.x=(e.clientX-t.left)/t.width*2-1,this.mouse.y=-((e.clientY-t.top)/t.height)*2+1,e.type==="mouseup"||e.type==="mouseleave"){e.type==="mouseleave"&&(this.onHeightAtCursor&&this.onHeightAtCursor(null),this.onHoverTile&&this.onHoverTile(null),this.onRampPreview&&this.onRampPreview(null,null)),e.type==="mouseup"&&e.buttons===2&&this.brushMode==="ramp"&&(this.rampPointA=null,this.onRampPreview&&this.onRampPreview(null,null));return}if(e.type==="mousemove"){const n=this._getTileAtCursor(),i=n?this.heightMap[n.gy][n.gx]:null;if(this.onHeightAtCursor&&this.onHeightAtCursor(i,n),this.brushMode==="ramp"&&this.rampPointA&&n&&this.onRampPreview?this.onRampPreview(this.rampPointA,{gx:n.gx,gy:n.gy,h:i}):this.brushMode==="ramp"&&!this.rampPointA&&this.onRampPreview&&this.onRampPreview(null,null),this.onHoverTile&&n){const r=this.brushSizeInTiles,o=this.tileSize,a=Math.floor(r/2),l=Math.max(0,n.tx-a),c=Math.max(0,n.ty-a),h=Math.min(this.tilesX,n.tx-a+r),u=Math.min(this.tilesY,n.ty-a+r),d=l*o,p=c*o,g=Math.min(this.gridSize+1,h*o+1),_=Math.min(this.gridSize+1,u*o+1);this.onHoverTile({t0x:l,t0y:c,t1x:h,t1y:u,x0:d,y0:p,x1:g,y1:_})}else this.onHoverTile&&this.onHoverTile(null);this.brushMode!=="ramp"&&e.buttons===1&&!this.applyOnClickOnly&&(!this.canPaint||this.canPaint())&&this._applyBrush(!1);return}if(e.type==="mousedown"&&e.buttons===1&&(!this.canPaint||this.canPaint())){const n=this._getTileAtCursor();this.brushMode==="ramp"?this._handleRampClick(n):this._applyBrush(!0)}}_handleRampClick(e){if(!e||!this.heightMap)return;const t=this.heightMap[e.gy][e.gx];if(!this.rampPointA){this.rampPointA={gx:e.gx,gy:e.gy,h:t};return}const n=this.rampPointA,i={gx:e.gx,gy:e.gy,h:this.heightMap[e.gy][e.gx]};n.gx===i.gx&&n.gy===i.gy||(this.onBeforeBrush&&this.onBeforeBrush(),this._applyRamp(n,i),this.rampPointA=null,this.onRampPreview&&this.onRampPreview(null,null),this.visualizer.updateFromHeightMap(this.heightMap),this.onAfterBrush&&this.onAfterBrush())}_applyRamp(e,t){const n=Math.abs(t.gx-e.gx),i=Math.abs(t.gy-e.gy),r=Math.max(n,i,1);Math.sqrt((t.gx-e.gx)**2+(t.gy-e.gy)**2);for(let o=0;o<=r;o++){const a=o/r,l=Math.round(e.gx+(t.gx-e.gx)*a),c=Math.round(e.gy+(t.gy-e.gy)*a);if(l<0||l>this.gridSize||c<0||c>this.gridSize)continue;const h=e.h+(t.h-e.h)*a;let u=Math.max(0,Math.min(2,h));(this.elevMin>0||this.elevMax<1)&&(u=Math.max(this.elevMin>0?this.elevMin:0,Math.min(this.elevMax<1?this.elevMax:2,u))),this.heightMap[c][l]=u}}_getTileAtCursor(){const e=this.visualizer.getMesh();if(!e||!this.heightMap)return null;this.raycaster.setFromCamera(this.mouse,this.visualizer.getCamera()),this.raycaster.layers.set(0);const t=this.raycaster.intersectObject(e,!1);if(t.length===0)return null;const n=t[0];let i,r;if(n.uv)i=Math.max(0,Math.min(1,n.uv.x)),r=Math.max(0,Math.min(1,1-n.uv.y));else{const h=n.point.clone();e.worldToLocal(h),i=Math.max(0,Math.min(1,h.x+.5)),r=Math.max(0,Math.min(1,.5-h.y))}if(this.tilesX<=0||this.tilesY<=0)return null;const o=Math.min(this.tilesX-1,Math.max(0,Math.floor(i*this.tilesX))),a=Math.min(this.tilesY-1,Math.max(0,Math.floor(r*this.tilesY))),l=Math.min(this.gridSize,Math.max(0,Math.round(i*this.gridSize))),c=Math.min(this.gridSize,Math.max(0,Math.round(r*this.gridSize)));return{tx:o,ty:a,gx:l,gy:c}}_getHeightAtCursor(){const e=this._getTileAtCursor();return e?this.heightMap[e.gy][e.gx]:null}_applyBrush(e=!1){if(!this.visualizer.getMesh()||!this.heightMap)return;const n=this._getTileAtCursor();if(!n)return;const{tx:i,ty:r}=n,o=this.brushSizeInTiles,a=this.tileSize,l=Math.floor(o/2),c=Math.max(0,i-l),h=Math.max(0,r-l),u=Math.min(this.tilesX,i-l+o),d=Math.min(this.tilesY,r-l+o),p=c*a,g=h*a,_=Math.min(this.gridSize+1,u*a+1),m=Math.min(this.gridSize+1,d*a+1),f=this.brushMode==="plateau"?this.heightMap[n.gy][n.gx]:null;e&&this.onBeforeBrush&&this.onBeforeBrush();let x=!1;if(this.brushMode==="smooth"){const v=this.heightMap.map(M=>[...M]);for(let M=g;M<m;M++)for(let y=p;y<_;y++){if(M>this.gridSize||y>this.gridSize)continue;let b=0,w=0;for(let L=-1;L<=1;L++)for(let F=-1;F<=1;F++){const z=y+F,D=M+L;z>=0&&z<=this.gridSize&&D>=0&&D<=this.gridSize&&(b+=this.heightMap[D][z],w++)}const U=w>0?b/w:this.heightMap[M][y],S=this.brushStrength*5;let E=Math.max(0,Math.min(2,this.heightMap[M][y]+(U-this.heightMap[M][y])*S));(this.elevMin>0||this.elevMax<1)&&(E=Math.max(this.elevMin>0?this.elevMin:0,Math.min(this.elevMax<1?this.elevMax:2,E))),v[M][y]=E,x=!0}for(let M=g;M<m;M++)for(let y=p;y<_;y++)M<=this.gridSize&&y<=this.gridSize&&(this.heightMap[M][y]=v[M][y])}else for(let v=g;v<m;v++)for(let M=p;M<_;M++){if(v>this.gridSize||M>this.gridSize)continue;let y=this.heightMap[v][M];this.brushMode==="raise"?y=Math.min(2,y+this.brushStrength):this.brushMode==="lower"?y=Math.max(0,y-this.brushStrength):this.brushMode==="flatten"?y=y+(this.brushTargetHeight-y)*this.brushStrength*5:this.brushMode==="absolute"?(y=y+(this.brushTargetHeight-y)*this.brushStrength*10,y=Math.max(0,Math.min(2,y))):this.brushMode==="set"?y=this.brushTargetHeight:this.brushMode==="plateau"&&f!=null&&(y=y+(f-y)*this.brushStrength*8,y=Math.max(0,Math.min(2,y))),(this.elevMin>0||this.elevMax<1)&&(y=Math.max(this.elevMin>0?this.elevMin:0,Math.min(this.elevMax<1?this.elevMax:2,y))),this.heightMap[v][M]=y,x=!0}x&&(this.visualizer.updateFromHeightMap(this.heightMap),this.onAfterBrush&&this.onAfterBrush())}}class ux{constructor(e){this.visualizer=e,this.raycaster=new Zs,this.mouse=new Le,this.buildings=[],this.heightMap=null,this.gridSize=0,this.tileSize=8,this.tilesX=0,this.tilesY=0,this.seaLevel=.12,this.selectedType="tavern",this.isPlacing=!1,this.domElement=null,this._boundHandleMouse=this._handleMouse.bind(this),this.onBuildingsChange=null,this.onHeightMapChange=null,this.onPlacementHover=null,this.onConnectivityWarning=null,this.connectivityCheckEnabled=!0,this.onBuildingHover=null,this.onBuildingSelect=null,this._boundHandleMouseMove=this._handleMouseMove.bind(this)}setHeightMap(e){this.heightMap=e?e.map(t=>[...t]):null,this.gridSize=this.heightMap?this.heightMap.length-1:0}setTileConfig(e,t,n){this.tileSize=e||8,this.tilesX=t??Math.floor(this.gridSize/this.tileSize),this.tilesY=n??Math.floor(this.gridSize/this.tileSize)}setSeaLevel(e){this.seaLevel=e??.12}setBuildings(e,t={}){this.buildings=Array.isArray(e)?t.shared?e:e.map(n=>({...n})):[]}getBuildings(){return this.buildings.map(e=>({...e}))}getViableTiles(){const e=new Set;if(!this.heightMap||!this.tilesX||!this.tilesY)return e;const t=this.selectedType;for(let n=0;n<this.tilesY;n++)for(let i=0;i<this.tilesX;i++)this._canPlace(t,i,n)&&e.add(`${i},${n}`);return e}setSelectedType(e){du[e]&&(this.selectedType=e)}enable(e,t={}){this.domElement=e,this._selectionOnly=!!t.selectionOnly,e.addEventListener("mousedown",this._boundHandleMouse),e.addEventListener("mousemove",this._boundHandleMouseMove),this.isPlacing=!this._selectionOnly}disable(){this.domElement&&(this.domElement.removeEventListener("mousedown",this._boundHandleMouse),this.domElement.removeEventListener("mousemove",this._boundHandleMouseMove)),this.isPlacing=!1,this._selectionOnly=!1,this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onBuildingHover&&this.onBuildingHover(null)}_updateMouseFromEvent(e){if(!this.domElement)return;const t=this.domElement.getBoundingClientRect();this.mouse.x=(e.clientX-t.left)/t.width*2-1,this.mouse.y=-((e.clientY-t.top)/t.height)*2+1}_handleMouseMove(e){if(!this.heightMap||!this.visualizer.getMesh()||!this.domElement)return;this._updateMouseFromEvent(e);const t=this._getTileAtCursor();if(!t){this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onBuildingHover&&this.onBuildingHover(null);return}const{tx:n,ty:i}=t,r=this._getBuildingAtTile(n,i);if(r)this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onBuildingHover&&this.onBuildingHover(r);else{if(this._selectionOnly)this.onPlacementHover&&this.onPlacementHover(null,null,!1,!0);else{const o=this._canPlace(this.selectedType,n,i);let a=!0;if(o&&this.connectivityCheckEnabled&&this.buildings.length>0){const l={tileSize:this.tileSize,tilesX:this.tilesX,tilesY:this.tilesY,seaLevel:this.seaLevel};a=sh(this.selectedType,n,i,this.buildings,this.heightMap,l)}this.onPlacementHover&&this.onPlacementHover(n,i,o,a)}this.onBuildingHover&&this.onBuildingHover(null)}}_getTileAtCursor(){const e=this.visualizer.getMesh();if(!e||!this.heightMap)return null;this.raycaster.setFromCamera(this.mouse,this.visualizer.getCamera()),this.raycaster.layers.set(0);const t=this.raycaster.intersectObject(e,!1);if(t.length===0)return null;const n=t[0];let i,r;if(n.uv)i=Math.max(0,Math.min(1,n.uv.x)),r=Math.max(0,Math.min(1,1-n.uv.y));else{const l=n.point.clone();e.worldToLocal(l),i=Math.max(0,Math.min(1,l.x+.5)),r=Math.max(0,Math.min(1,.5-l.y))}if(this.tilesX<=0||this.tilesY<=0)return null;const o=Math.min(this.tilesX-1,Math.max(0,Math.floor(i*this.tilesX))),a=Math.min(this.tilesY-1,Math.max(0,Math.floor(r*this.tilesY)));return{tx:o,ty:a}}_getBuildingAtTile(e,t){for(const n of this.buildings){const i=$n(n.type),r=i.width,o=i.height;if(e>=n.chunkX&&e<n.chunkX+r&&t>=n.chunkY&&t<n.chunkY+o)return n}return null}flattenRegion(e,t,n,i,r){var f;if(!sn(r)||!this.heightMap)return;const a=this.tileSize,l=this.heightMap.length-1,c=Math.max(0,e*a),h=Math.max(0,t*a),u=Math.min(l,(e+n)*a),d=Math.min(l,(t+i)*a);let p=0,g=0;for(let x=h;x<=d;x++)for(let v=c;v<=u;v++){const M=((f=this.heightMap[x])==null?void 0:f[v])??0;M>this.seaLevel&&(p+=M,g++)}const _=g>0?p/g:this.seaLevel+.02,m=this.seaLevel+.02;for(let x=h;x<=d;x++)for(let v=c;v<=u;v++){if(!this.heightMap[x])continue;const M=this.heightMap[x][v]??0;jo(r)&&M<=this.seaLevel?this.heightMap[x][v]=m:this.heightMap[x][v]=_}this.onHeightMapChange&&this.onHeightMapChange(this.heightMap.map(x=>[...x]))}_flattenUnderBuilding(e,t,n){const i=$n(e);this.flattenRegion(t,n,i.width,i.height,e)}canPlaceAtFootprint(e,t,n,i,r,o=null){var h;const a=jo(r);if(!a&&(e+n>this.tilesX||t+i>this.tilesY||e<0||t<0))return!1;const l=this.tileSize;let c=0;for(let u=0;u<i;u++)for(let d=0;d<n;d++){const p=e+d,g=t+u;if(p<0||p>=this.tilesX||g<0||g>=this.tilesY)continue;const _=Math.min(this.gridSize,p*l),m=Math.min(this.gridSize,g*l);if((((h=this.heightMap[m])==null?void 0:h[_])??0)>this.seaLevel)c++;else if(!a)return!1}if(c===0||a&&(e+n<=0||t+i<=0||e>=this.tilesX||t>=this.tilesY))return!1;for(const u of this.buildings){if(o&&u.chunkX===o.chunkX&&u.chunkY===o.chunkY)continue;const d=yn(u),p=u.chunkX+d.width,g=u.chunkY+d.height;if(e<p&&e+n>u.chunkX&&t<g&&t+i>u.chunkY)return!1}return!0}_canPlace(e,t,n){var u;if(!sn(e))return!1;const r=$n(e),o=r.width,a=r.height,l=jo(e);if(!l&&(t+o>this.tilesX||n+a>this.tilesY||t<0||n<0))return!1;const c=this.tileSize;let h=0;for(let d=0;d<a;d++)for(let p=0;p<o;p++){const g=t+p,_=n+d;if(g<0||g>=this.tilesX||_<0||_>=this.tilesY)continue;const m=Math.min(this.gridSize,g*c),f=Math.min(this.gridSize,_*c);if((((u=this.heightMap[f])==null?void 0:u[m])??0)>this.seaLevel)h++;else if(!l)return!1}if(h===0||l&&(t+o<=0||n+a<=0||t>=this.tilesX||n>=this.tilesY))return!1;for(const d of this.buildings){const p=yn(d),g=d.chunkX+p.width,_=d.chunkY+p.height;if(t<g&&t+o>d.chunkX&&n<_&&n+a>d.chunkY)return!1}return!0}_handleMouse(e){if(e.type!=="mousedown"||e.buttons!==1||!this.heightMap||!this.visualizer.getMesh()||!this.domElement)return;this._updateMouseFromEvent(e);const t=this._getTileAtCursor();if(!t)return;const{tx:n,ty:i}=t,r=this._getBuildingAtTile(n,i);if(r)if(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),this._selectionOnly)this.onBuildingSelect&&this.onBuildingSelect(r);else if(e.shiftKey)this.buildings=this.buildings.filter(o=>o!==r);else{if(sn(r.type)){const a=[0,90,180,270],l=a.indexOf(r.rotation??0);r.rotation=a[(l+1)%4]}this.onBuildingSelect&&this.onBuildingSelect(r)}else if(!this._selectionOnly&&sn(this.selectedType)&&this._canPlace(this.selectedType,n,i)){if(this.connectivityCheckEnabled&&this.buildings.length>0){const c={tileSize:this.tileSize,tilesX:this.tilesX,tilesY:this.tilesY,seaLevel:this.seaLevel};sh(this.selectedType,n,i,this.buildings,this.heightMap,c)||this.onConnectivityWarning&&this.onConnectivityWarning()}this._flattenUnderBuilding(this.selectedType,n,i);const a=$n(this.selectedType),l=a.width*a.height*10;this.buildings.push({id:"b"+Date.now(),type:this.selectedType,chunkX:n,chunkY:i,rotation:0,width:a.width,height:a.height,cargoSize:l})}this._selectionOnly||(this.visualizer.renderBuildings(this.buildings,this.heightMap,this.tileSize,this.tilesX,this.tilesY),this.onBuildingsChange&&this.onBuildingsChange(this.getBuildings()))}}class dx{constructor(e){this.visualizer=e,this.raycaster=new Zs,this.mouse=new Le,this.props=[],this.buildings=[],this.heightMap=null,this.gridSize=0,this.tileSize=8,this.tilesX=0,this.tilesY=0,this.seaLevel=.12,this.selectedType="rock_01",this.domElement=null,this._boundHandleMouse=this._handleMouse.bind(this),this._boundHandleMouseMove=this._handleMouseMove.bind(this),this._hoverRafId=null,this._lastHoverProp=null,this.onPropsChange=null,this.onPlacementHover=null,this.onPropHover=null,this.onPropSelect=null}setHeightMap(e){this.heightMap=e?e.map(t=>[...t]):null,this.gridSize=this.heightMap?this.heightMap.length-1:0}setTileConfig(e,t,n){this.tileSize=e||8,this.tilesX=t??Math.floor(this.gridSize/this.tileSize),this.tilesY=n??Math.floor(this.gridSize/this.tileSize)}setSeaLevel(e){this.seaLevel=e??.12}setProps(e){this.props=Array.isArray(e)?e.map(t=>({...t})):[]}setBuildings(e){this.buildings=Array.isArray(e)?e:[]}getProps(){return this.props.map(e=>({...e}))}setSelectedType(e){pu[e]&&(this.selectedType=e)}enable(e,t={}){this.domElement=e,this._selectionOnly=!!t.selectionOnly,e.addEventListener("mousedown",this._boundHandleMouse),e.addEventListener("mousemove",this._boundHandleMouseMove)}disable(){this.domElement&&(this.domElement.removeEventListener("mousedown",this._boundHandleMouse),this.domElement.removeEventListener("mousemove",this._boundHandleMouseMove)),this._hoverRafId!=null&&(cancelAnimationFrame(this._hoverRafId),this._hoverRafId=null),this._lastHoverProp=null,this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onPropHover&&this.onPropHover(null)}_updateMouseFromEvent(e){var i,r,o,a;if(!this.domElement)return;const t=(o=(r=(i=this.visualizer).getRenderer)==null?void 0:r.call(i))==null?void 0:o.domElement,n=((a=t==null?void 0:t.getBoundingClientRect)==null?void 0:a.call(t))??this.domElement.getBoundingClientRect();n.width<=0||n.height<=0||(this.mouse.x=(e.clientX-n.left)/n.width*2-1,this.mouse.y=-((e.clientY-n.top)/n.height)*2+1)}_getTileAtCursor(){const e=this.visualizer.getMesh();if(!e||!this.heightMap)return null;this.raycaster.setFromCamera(this.mouse,this.visualizer.getCamera()),this.raycaster.layers.set(0);const t=this.raycaster.intersectObject(e,!1);if(t.length===0)return null;const n=t[0];let i,r;if(n.uv)i=Math.max(0,Math.min(1,n.uv.x)),r=Math.max(0,Math.min(1,1-n.uv.y));else{const l=n.point.clone();e.worldToLocal(l),i=Math.max(0,Math.min(1,l.x+.5)),r=Math.max(0,Math.min(1,.5-l.y))}if(this.tilesX<=0||this.tilesY<=0)return null;const o=Math.min(this.tilesX-1,Math.max(0,Math.floor(i*this.tilesX))),a=Math.min(this.tilesY-1,Math.max(0,Math.floor(r*this.tilesY)));return{tx:o,ty:a}}_getPropAtTile(e,t){for(const n of this.props)if(n.chunkX===e&&n.chunkY===t)return n;return null}_isBuildingTile(e,t){for(const n of this.buildings){const i=yn(n),r=i.width,o=i.height;if(e>=n.chunkX&&e<n.chunkX+r&&t>=n.chunkY&&t<n.chunkY+o)return!0}return!1}_canPlaceProp(e,t){var o;if(e<0||e>=this.tilesX||t<0||t>=this.tilesY||this._isBuildingTile(e,t))return!1;const n=Math.min(this.gridSize,e*this.tileSize),i=Math.min(this.gridSize,t*this.tileSize);return(((o=this.heightMap[i])==null?void 0:o[n])??0)>this.seaLevel}_handleMouseMove(e){!this.heightMap||!this.visualizer.getMesh()||!this.domElement||(this._updateMouseFromEvent(e),this._hoverRafId==null&&(this._hoverRafId=requestAnimationFrame(()=>{this._hoverRafId=null,this._processHover()})))}_processHover(){var n,i;if(!this.heightMap||!this.visualizer.getMesh()||!this.domElement)return;const t=((i=(n=this.visualizer).pickPropAt)==null?void 0:i.call(n,this.mouse))??null??(()=>{const r=this._getTileAtCursor();return r?this._getPropAtTile(r.tx,r.ty):null})();if(t!==this._lastHoverProp)if(this._lastHoverProp=t,t)this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onPropHover&&this.onPropHover(t);else{const r=this._getTileAtCursor();if(!r){this.onPlacementHover&&this.onPlacementHover(null,null,!1),this.onPropHover&&this.onPropHover(null);return}const{tx:o,ty:a}=r,l=this._canPlaceProp(o,a);this.onPlacementHover&&this.onPlacementHover(o,a,l),this.onPropHover&&this.onPropHover(null)}}_handleMouse(e){var r,o;if(e.type!=="mousedown"||e.buttons!==1||!this.heightMap||!this.visualizer.getMesh()||!this.domElement)return;this._updateMouseFromEvent(e);const n=((o=(r=this.visualizer).pickPropAt)==null?void 0:o.call(r,this.mouse))??null??(()=>{const a=this._getTileAtCursor();return a?this._getPropAtTile(a.tx,a.ty):null})();let i=!1;if(n)e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),e.shiftKey?(this.props=this.props.filter(a=>a!==n),i=!0):this.onPropSelect&&this.onPropSelect(n);else if(!this._selectionOnly){const a=this._getTileAtCursor();if(!a)return;const{tx:l,ty:c}=a,h=Bn(this.selectedType);if(h&&this._canPlaceProp(l,c)){const u=h.defaultScale??1;this.props.push({id:"p"+Date.now(),type:this.selectedType,chunkX:l,chunkY:c,rotation:0,offsetX:0,offsetY:0,offsetZ:0,scale:u}),i=!0}}i&&(this.visualizer.renderProps(this.props,this.heightMap,this.tileSize,this.tilesX,this.tilesY),this.onPropsChange&&this.onPropsChange(this.getProps()))}}function fx(s){const e={version:1,config:s.config,display:s.display??{},buildings:s.buildings??[],props:s.props??[],seed:s.seed,name:s.name??"",description:s.description??"",dangerous:s.dangerous??!1,appealing:s.appealing??!1,treasureLevel:s.treasureLevel??0,portType:s.portType??"none",hazard:s.hazard??"none",faction:s.faction??"neutral",rumors:s.rumors??""};return s.heightMap!=null&&(e.heightMap=s.heightMap),JSON.stringify(e)}function Au(s){const e=JSON.parse(s);if(!e.config||typeof e.config!="object")throw new Error("Invalid island file: missing config");return{heightMap:Array.isArray(e.heightMap)?e.heightMap:null,config:e.config,display:e.display??{},buildings:Array.isArray(e.buildings)?e.buildings:[],props:Array.isArray(e.props)?e.props:[],seed:e.seed??null,name:e.name??"",description:e.description??"",dangerous:e.dangerous??!1,appealing:e.appealing??!1,treasureLevel:e.treasureLevel??0,portType:e.portType??"none",hazard:e.hazard??"none",faction:e.faction??"neutral",rumors:e.rumors??""}}const Jn=document.getElementById("canvas-container"),px=document.getElementById("regenerate"),mx=document.getElementById("stats"),Ji=document.getElementById("elevation-hud"),an=document.getElementById("build-mode-hud"),Z=new lx(Jn);Z.init();Z.animate();Z.setOnPropMeshLoaded(()=>{var i,r;if(!((i=P==null?void 0:P.props)!=null&&i.length))return;const s=P.config,e=(s==null?void 0:s.tileSize)??(s==null?void 0:s.chunkSize)??8,t=(s==null?void 0:s.tilesX)??Math.floor((((r=P.heightMap)==null?void 0:r.length)-1)/e),n=(s==null?void 0:s.tilesY)??t;Z.renderProps(P.props,P.heightMap,e,t,n),vn()});Z.setOnPropTransformChange(s=>{nn()});const Ce=new hx(Z),J=new ux(Z),Re=new dx(Z);let P=null,yi=!1,mt=!1,Si="buildings",Ve=null,Qe=null,va=!0;const gx=20;let Ei=[],Ys=[];function _x(s){const e=String(s).trim();if(!e)return null;const t=parseInt(e,10);return isNaN(t)?null:t}function Na(){var _;const s=Math.max(4,Math.min(32,parseInt(document.getElementById("tile-size").value,10)||8));let e=Math.max(16,Math.min(2048,parseInt(document.getElementById("grid-size").value,10)||1080));e=Math.floor(e/s)*s||s;const t=(parseInt(document.getElementById("elevation-scale").value,10)||80)/100,n=(parseInt(document.getElementById("island-radius").value,10)||70)/100,i=(parseInt(document.getElementById("coast-falloff").value,10)||35)/10,r=(parseInt(document.getElementById("coast-irregularity").value,10)||25)/100,o=(parseInt(document.getElementById("elongation").value,10)||80)/100,a=(parseInt(document.getElementById("sea-level").value,10)||12)/100,l=(parseInt(document.getElementById("terrain-roughness").value,10)||70)/100,c=(parseInt(document.getElementById("tile-variation").value,10)||0)/100,h=Math.max(1,Math.min(8,parseInt(document.getElementById("noise-octaves").value,10)||3)),u=(parseInt(document.getElementById("noise-frequency").value,10)||10)/10,d=(parseInt(document.getElementById("noise-persistence").value,10)||75)/100,p=(parseInt(document.getElementById("noise-lacunarity").value,10)||26)/10,g=Math.max(1,Math.min(5,parseInt((_=document.getElementById("path-width"))==null?void 0:_.value,10)||1));return{gridSize:e,tileSize:s,elevationScale:1.2*t,islandRadius:.2+n*.6,coastFalloff:i,coastIrregularity:r,elongation:o,seaLevel:a,terrainRoughness:l,tileVariation:c,chunkSize:s,noiseOctaves:h,frequency:u,persistence:d,lacunarity:p,pathWidth:g,seed:_x(document.getElementById("seed").value)}}function Oa(s){var m;if(!s)return;const{heightMap:e,config:t,seed:n}=s,i=e.length,r=((m=e[0])==null?void 0:m.length)??0;let o=1/0,a=-1/0,l=0,c=0;for(let f=0;f<i;f++)for(let x=0;x<r;x++){const v=e[f][x];v>0&&(o=Math.min(o,v),a=Math.max(a,v),l+=v,c++)}const h=c?(l/c).toFixed(3):"—",u=n!=null?` Seed: ${n}`:"",d=(t==null?void 0:t.tileSize)??(t==null?void 0:t.chunkSize)??8,p=i-1,g=d>0?Math.floor(p/d)**2:0,_=g>0?` ${g} tiles`:"";mx.textContent=`${i}×${r} vertices. Min: ${o.toFixed(2)} Max: ${a.toFixed(2)} Avg: ${h}.${_}${u}`}function Ba(){var r,o,a,l,c,h,u,d,p;const s=document.getElementById("seed"),e=String(s.value).trim()!=="",t=Na(),n=xa(t);if(n.config={...n.config,pathWidth:t.pathWidth},n.props=n.props??[],P=n,Ce.setHeightMap(n.heightMap),Z.setConfig({heightScale:(parseInt(document.getElementById("height-scale").value,10)||100)/100,wireframe:document.getElementById("wireframe").checked,shadows:((r=document.getElementById("shadows"))==null?void 0:r.checked)!==!1,showWater:!0}),((o=n.buildings)==null?void 0:o.length)>=2){const{pathTiles:g,heightMap:_}=Di(n.buildings,n.heightMap,n.config);n.heightMap=_,n.pathTiles=[...g]}else n.pathTiles=[];if(Z.render(n),(a=n.buildings)!=null&&a.length){const g=n.config,_=(g==null?void 0:g.tileSize)??(g==null?void 0:g.chunkSize)??8,m=Math.floor((n.heightMap.length-1)/_),f=m;Z.renderBuildings(n.buildings,n.heightMap,_,m,f)}if((l=n.props)!=null&&l.length){const g=n.config,_=(g==null?void 0:g.tileSize)??(g==null?void 0:g.chunkSize)??8,m=(g==null?void 0:g.tilesX)??Math.floor((n.heightMap.length-1)/_),f=(g==null?void 0:g.tilesY)??m;Z.renderProps(n.props,n.heightMap,_,m,f)}if(((c=document.getElementById("show-grid-overlay"))==null?void 0:c.checked)&&(n!=null&&n.heightMap)){const g=n.config,_=(g==null?void 0:g.tileSize)??(g==null?void 0:g.chunkSize)??8,m=(g==null?void 0:g.tilesX)??Math.floor((n.heightMap.length-1)/_),f=(g==null?void 0:g.tilesY)??m;Z.setTileGridOverlay(!0,m,f,n.heightMap.length-1)}if(e&&(s.value=n.seed),Oa(n),za(),Ve=null,Qe=null,vn(),jt(),nn(),Ui(),mt||(J.disable(),J.onBuildingsChange=null,J.onHeightMapChange=null,J.onPlacementHover=null,J.onConnectivityWarning=null,J.onBuildingHover=null,J.onBuildingSelect=null,Re.disable(),Re.onPropsChange=null,Re.onPlacementHover=null,Re.onPropHover=null,Re.onPropSelect=null),!mt&&(((h=n.buildings)==null?void 0:h.length)??0)>0){J.setHeightMap(n.heightMap);const g=n.config,_=(g==null?void 0:g.tileSize)??(g==null?void 0:g.chunkSize)??8,m=(g==null?void 0:g.tilesX)??Math.floor((((u=n.heightMap)==null?void 0:u.length)-1)/_),f=(g==null?void 0:g.tilesY)??m;J.setTileConfig(_,m,f),J.setSeaLevel((g==null?void 0:g.seaLevel)??.12),J.setBuildings(n.buildings,{shared:!0}),J.onBuildingHover=x=>{const v=P==null?void 0:P.heightMap,M=P==null?void 0:P.config,y=(M==null?void 0:M.tileSize)??(M==null?void 0:M.chunkSize)??8,b=(M==null?void 0:M.tilesX)??Math.floor(((v==null?void 0:v.length)-1)/y),w=(M==null?void 0:M.tilesY)??b;x&&v?Z.setBuildingHighlight(x,v,y,b,w):Z.clearBuildingHighlight()},J.onBuildingSelect=x=>{Ve=x,jt()},J.onPlacementHover=()=>Z.clearPlacementPreview(),J.enable(Jn,{selectionOnly:!0})}if(!mt&&(((d=n.props)==null?void 0:d.length)??0)>0){Re.setHeightMap(n.heightMap);const g=n.config,_=(g==null?void 0:g.tileSize)??(g==null?void 0:g.chunkSize)??8,m=(g==null?void 0:g.tilesX)??Math.floor((((p=n.heightMap)==null?void 0:p.length)-1)/_),f=(g==null?void 0:g.tilesY)??m;Re.setTileConfig(_,m,f),Re.setSeaLevel((g==null?void 0:g.seaLevel)??.12),Re.setProps(n.props),Re.setBuildings(n.buildings??[]),Re.onPropHover=x=>{const v=P==null?void 0:P.heightMap,M=P==null?void 0:P.config,y=(M==null?void 0:M.tileSize)??(M==null?void 0:M.chunkSize)??8,b=(M==null?void 0:M.tilesX)??Math.floor(((v==null?void 0:v.length)-1)/y),w=(M==null?void 0:M.tilesY)??b;x&&v?Z.setPropHighlight(x,v,y,b,w):Z.clearPropHighlight()},Re.onPropSelect=x=>{Qe=x,Ve=null,nn(),jt(),vn()},Re.onPlacementHover=()=>Z.clearPropPlacementPreview(),Re.enable(Jn,{selectionOnly:!0})}mt&&no(!0)}function Ms(s){var i,r,o,a,l,c,h,u;s&&mt&&no(!1),yi=s;const e=document.getElementById("edit-panel"),t=document.getElementById("edit-mode-btn");e&&(e.style.display=s?"block":"none"),t&&(t.textContent=s?"Edit Mode (On)":"Edit Mode (Off)",t.classList.toggle("active",s)),Z.setInputMode(s?"edit":"view");const n=document.getElementById("input-hint");if(n&&(n.textContent=s?"Left=paint · Right=orbit · Space+Left=orbit · Scroll=zoom":"Left=orbit · Right=pan · Scroll=zoom"),s){Ce.setHeightMap(P==null?void 0:P.heightMap);const d=P==null?void 0:P.config;Ce.setTileConfig((d==null?void 0:d.tileSize)??(d==null?void 0:d.chunkSize)??8,d==null?void 0:d.tilesX,d==null?void 0:d.tilesY),Ce.enable(Jn),Ce.setBrushSizeInTiles(parseInt((i=document.getElementById("brush-size-tiles"))==null?void 0:i.value,10)||1),Ce.setBrushStrength((parseInt(document.getElementById("brush-strength").value,10)||16)/40*.2),Ce.setBrushMode(document.getElementById("brush-mode").value),Ce.setApplyOnClickOnly(((r=document.getElementById("brush-apply-mode"))==null?void 0:r.value)==="click"),Ce.setCanPaint(()=>!Z.isSpaceHeld()),Ce.setBrushTargetHeight(parseFloat(document.getElementById("brush-target").value)||.35),Ce.setSeaLevel(((o=P==null?void 0:P.config)==null?void 0:o.seaLevel)??.12);const p=((a=P==null?void 0:P.config)==null?void 0:a.seaLevel)??.12,g=parseFloat((l=document.getElementById("elev-min"))==null?void 0:l.value)||0,_=parseFloat((c=document.getElementById("elev-max"))==null?void 0:c.value)??1;Ce.setElevationClamp(g,_),Ce.onHeightAtCursor=(f,x)=>{if(Ji)if(Ji.style.display=f!=null?"block":"none",f!=null){const v=f<=p?"Water":f<.2?"Beach":f<.45?"Grass":f<.7?"Rock":"Snow",M=x?` | Tile: (${x.tx},${x.ty})`:"";Ji.textContent=`Elev: ${f.toFixed(3)} | ${v}${M}`}else Ji.textContent="Elev: —"},Ce.onHoverTile=f=>{if(f){const x=Ce.getHeightMap();x?Z.setHoverOverlay({x0:f.x0,y0:f.y0,x1:f.x1,y1:f.y1},x):Z.setHoverOverlay(null)}else Z.setHoverOverlay(null)},Ce.onBeforeBrush=vx,Ce.onAfterBrush=Ui,Ce.onRampPreview=(f,x)=>{var M,y;const v=((M=P==null?void 0:P.heightMap)==null?void 0:M.length)-1;f&&x&&v>0?Z.setRampPreview(f,x,v):(y=Z._clearRampPreview)==null||y.call(Z)},Ei=[],Ys=[];const m=((h=document.getElementById("brush-mode"))==null?void 0:h.value)||"raise";document.querySelectorAll(".brush-tool-btn").forEach(f=>f.setAttribute("aria-pressed",f.dataset.mode===m?"true":"false"))}else Ce.setCanPaint(null),Ce.onRampPreview=null,Ce.disable(),Z.setHoverOverlay(null),(u=Z._clearRampPreview)==null||u.call(Z),Ji&&(Ji.style.display="none")}function no(s){var i,r,o,a,l,c,h,u,d,p,g,_,m,f,x;s&&yi&&Ms(!1),mt=s;const e=document.getElementById("build-panel"),t=document.getElementById("build-mode-btn");e&&(e.style.display=s?"block":"none"),t&&(t.textContent=s?"Build Mode (On)":"Build Mode (Off)",t.classList.toggle("active",s)),Z.setInputMode(s||yi?"edit":"view");const n=document.getElementById("input-hint");if(n&&(n.textContent=s?"Left=place · Right=orbit · Shift+Left=remove · Scroll=zoom":yi?"Left=paint · Right=orbit · Space+Left=orbit · Scroll=zoom":"Left=orbit · Right=pan · Scroll=zoom"),s){Si=((i=document.querySelector('input[name="place-mode"]:checked'))==null?void 0:i.value)||"buildings";const v=P==null?void 0:P.config,M=(v==null?void 0:v.tileSize)??(v==null?void 0:v.chunkSize)??8,y=(v==null?void 0:v.tilesX)??Math.floor((((r=P==null?void 0:P.heightMap)==null?void 0:r.length)-1)/M),b=(v==null?void 0:v.tilesY)??y;J.setHeightMap(P==null?void 0:P.heightMap),J.setTileConfig(M,y,b),J.setSeaLevel((v==null?void 0:v.seaLevel)??.12),J.setBuildings((P==null?void 0:P.buildings)??[]),J.setSelectedType(((o=document.getElementById("building-type"))==null?void 0:o.value)||"tavern"),Re.setHeightMap(P==null?void 0:P.heightMap),Re.setTileConfig(M,y,b),Re.setSeaLevel((v==null?void 0:v.seaLevel)??.12),Re.setProps((P==null?void 0:P.props)??[]),Re.setBuildings((P==null?void 0:P.buildings)??[]),Re.setSelectedType(((l=(a=document.querySelector("#prop-palette .prop-palette-btn.selected"))==null?void 0:a.dataset)==null?void 0:l.type)||"rock_01"),J.onBuildingsChange=E=>{var O;P={...P,buildings:E},qs();const L=P==null?void 0:P.config,F=(L==null?void 0:L.tileSize)??(L==null?void 0:L.chunkSize)??8,z=(L==null?void 0:L.tilesX)??Math.floor((((O=P==null?void 0:P.heightMap)==null?void 0:O.length)-1)/F),D=(L==null?void 0:L.tilesY)??z;if(E.length>=2&&(P!=null&&P.heightMap)){const{pathTiles:H,heightMap:q}=Di(E,P.heightMap,{...L,tilesX:z,tilesY:D});P={...P,heightMap:q,pathTiles:[...H]},J.setHeightMap(q),Ce.setHeightMap(q),Z.updateFromHeightMap(q,H,F)}else P={...P,pathTiles:[]},Z.updateFromHeightMap(P.heightMap,new Set,F);ei(),lh()},J.onHeightMapChange=E=>{P={...P,heightMap:E},Ce.setHeightMap(E);const L=P==null?void 0:P.config,F=(L==null?void 0:L.tileSize)??(L==null?void 0:L.chunkSize)??8,z=P!=null&&P.pathTiles?new Set(P.pathTiles):new Set;Z.updateFromHeightMap(E,z,F)},J.onPlacementHover=(E,L,F,z)=>{va=z;const D=P==null?void 0:P.heightMap,O=P==null?void 0:P.config,H=(O==null?void 0:O.tileSize)??(O==null?void 0:O.chunkSize)??8,q=(O==null?void 0:O.tilesX)??Math.floor(((D==null?void 0:D.length)-1)/H),K=(O==null?void 0:O.tilesY)??q;E!=null&&L!=null&&D?Z.setPlacementPreview(E,L,J.selectedType,F,D,H,q,K,z):(Z.clearPlacementPreview(),va=!0),ei()},J.onConnectivityWarning=()=>{if(an){const E=an.textContent;an.textContent="⚠ Building isolated (no path to others)",an.style.color="#f59e0b",setTimeout(()=>{an.textContent=E,an.style.color="",ei()},2500)}},J.onBuildingHover=E=>{const L=P==null?void 0:P.heightMap,F=P==null?void 0:P.config,z=(F==null?void 0:F.tileSize)??(F==null?void 0:F.chunkSize)??8,D=(F==null?void 0:F.tilesX)??Math.floor(((L==null?void 0:L.length)-1)/z),O=(F==null?void 0:F.tilesY)??D;E&&L?Z.setBuildingHighlight(E,L,z,D,O):Z.clearBuildingHighlight()},J.onBuildingSelect=E=>{Ve=E,Qe=null,vn(),jt(),nn()},Re.onPropsChange=E=>{P={...P,props:E},Z.renderProps(E,(P==null?void 0:P.heightMap)??[],M,y,b),vn(),typeof ah=="function"&&ah()},Re.onPlacementHover=(E,L,F)=>{const z=P==null?void 0:P.heightMap;E!=null&&L!=null&&z?Z.setPropPlacementPreview(E,L,Re.selectedType,F,z,M,y,b):Z.clearPropPlacementPreview()},Re.onPropHover=E=>{const L=P==null?void 0:P.heightMap;E&&L?Z.setPropHighlight(E,L,M,y,b):Z.clearPropHighlight()},Re.onPropSelect=E=>{Qe=E,Ve=null,nn(),jt(),vn()},J.connectivityCheckEnabled=((c=document.getElementById("connectivity-check"))==null?void 0:c.checked)??!0,Si==="buildings"?((h=J.setHeightMap)==null||h.call(J,P.heightMap),(u=J.setTileConfig)==null||u.call(J,M,y,b),(d=J.setBuildings)==null||d.call(J,P.buildings??[],{shared:!0}),(p=J.setSeaLevel)==null||p.call(J,(v==null?void 0:v.seaLevel)??.12),J.enable(Jn),Re.disable()):(Re.enable(Jn),J.disable());const w=(g=document.getElementById("show-grid-overlay"))==null?void 0:g.checked;Z.setTileGridOverlay(w,y,b,((_=P==null?void 0:P.heightMap)==null?void 0:_.length)-1),qs(),Va(J.selectedType),Ga(J.selectedType),Cu(Re.selectedType);const U=document.getElementById("place-buildings-panel"),S=document.getElementById("place-props-panel");Si==="buildings"?(U&&(U.style.display="block"),S&&(S.style.display="none")):(U&&(U.style.display="none"),S&&(S.style.display="block")),lh(),jt(),nn()}else{J.disable(),Re.disable(),J.onBuildingsChange=null,J.onHeightMapChange=null,J.onPlacementHover=null,J.onConnectivityWarning=null,J.onBuildingHover=null,J.onBuildingSelect=null,Re.onPropsChange=null,Re.onPlacementHover=null,Re.onPropHover=null,Re.onPropSelect=null,Z.setTileGridOverlay(!1),(m=Z.setZoneHintsOverlay)==null||m.call(Z,!1),Z.clearPlacementPreview(),Z.clearBuildingHighlight(),Z.clearPropPlacementPreview(),Z.clearPropHighlight(),an&&(an.style.display="none");const v=(P==null?void 0:P.buildings)??[];if(v.length>0){J.setHeightMap(P.heightMap);const y=P.config,b=(y==null?void 0:y.tileSize)??(y==null?void 0:y.chunkSize)??8,w=(y==null?void 0:y.tilesX)??Math.floor((((f=P.heightMap)==null?void 0:f.length)-1)/b),U=(y==null?void 0:y.tilesY)??w;J.setTileConfig(b,w,U),J.setSeaLevel((y==null?void 0:y.seaLevel)??.12),J.setBuildings(v,{shared:!0}),J.onBuildingHover=S=>{const E=P==null?void 0:P.heightMap,L=P==null?void 0:P.config,F=(L==null?void 0:L.tileSize)??(L==null?void 0:L.chunkSize)??8,z=(L==null?void 0:L.tilesX)??Math.floor(((E==null?void 0:E.length)-1)/F),D=(L==null?void 0:L.tilesY)??z;S&&E?Z.setBuildingHighlight(S,E,F,z,D):Z.clearBuildingHighlight()},J.onBuildingSelect=S=>{Ve=S,jt()},J.onPlacementHover=()=>Z.clearPlacementPreview(),J.enable(Jn,{selectionOnly:!0})}else Ve=null;const M=(P==null?void 0:P.props)??[];if(M.length>0){Re.setHeightMap(P.heightMap);const y=P.config,b=(y==null?void 0:y.tileSize)??(y==null?void 0:y.chunkSize)??8,w=(y==null?void 0:y.tilesX)??Math.floor((((x=P.heightMap)==null?void 0:x.length)-1)/b),U=(y==null?void 0:y.tilesY)??w;Re.setTileConfig(b,w,U),Re.setSeaLevel((y==null?void 0:y.seaLevel)??.12),Re.setProps(M),Re.setBuildings(v),Re.onPropHover=S=>{const E=P==null?void 0:P.heightMap,L=P==null?void 0:P.config,F=(L==null?void 0:L.tileSize)??(L==null?void 0:L.chunkSize)??8,z=(L==null?void 0:L.tilesX)??Math.floor(((E==null?void 0:E.length)-1)/F),D=(L==null?void 0:L.tilesY)??z;S&&E?Z.setPropHighlight(S,E,F,z,D):Z.clearPropHighlight()},Re.onPropSelect=S=>{Qe=S,Ve=null,nn(),jt(),vn()},Re.onPlacementHover=()=>Z.clearPropPlacementPreview(),Re.enable(Jn,{selectionOnly:!0})}else Qe=null,vn();jt(),nn()}ei()}function qs(){var o,a,l,c,h,u;if(!mt||Si!=="buildings"||!(P!=null&&P.heightMap)){(o=Z.setZoneHintsOverlay)==null||o.call(Z,!1);return}if(!(((a=document.getElementById("zone-hints"))==null?void 0:a.checked)??!1)){(l=Z.setZoneHintsOverlay)==null||l.call(Z,!1);return}const e=P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=(e==null?void 0:e.tilesX)??Math.floor((((c=P.heightMap)==null?void 0:c.length)-1)/t),i=(e==null?void 0:e.tilesY)??n,r=((h=J.getViableTiles)==null?void 0:h.call(J))??new Set;(u=Z.setZoneHintsOverlay)==null||u.call(Z,!0,r,P.heightMap,t,n,i)}function ei(){if(an&&mt){if(Si==="props"){const s=Bn(Re.selectedType),e=(s==null?void 0:s.name)??Re.selectedType??"—",t=Re.getProps().length;an.textContent=`Prop: ${e} · ${t} placed`}else{const s=sn(J.selectedType),e=(s==null?void 0:s.name)??J.selectedType??"—",t=J.getBuildings().length;let n=`Building: ${e} · ${t} placed`;va||(n+=" · ⚠ Isolated"),an.textContent=n}an.style.display="block"}}function ah(){ei()}function lh(){const s=document.getElementById("buildings-list"),e=document.getElementById("buildings-list-items");if(!s||!e)return;const t=(J==null?void 0:J.getBuildings())??(P==null?void 0:P.buildings)??[];if(t.length===0){s.style.display="none";return}s.style.display="block";const n=s.querySelector(".control-section-title");n&&(n.textContent=`Placed (${t.length})`),e.innerHTML=t.map((i,r)=>{const o=sn(i.type),a=(o==null?void 0:o.name)??i.type;return`${r+1}. ${a} @ (${i.chunkX},${i.chunkY})`}).join("<br>")}function za(){if(!P)return;const s=(t,n)=>{const i=document.getElementById(t);i&&(i.value=String(n??""))};s("island-prop-name",P.name??""),s("island-prop-description",P.description??"");const e=document.getElementById("island-prop-trait");e&&(e.value=P.dangerous?"dangerous":P.appealing?"appealing":"normal"),s("island-prop-treasure",P.treasureLevel??0),s("island-prop-port",P.portType??"none"),s("island-prop-hazard",P.hazard??"none"),s("island-prop-faction",P.faction??"neutral"),s("island-prop-rumors",P.rumors??"")}function Pu(){if(!P)return;const s=t=>{const n=document.getElementById(t);return n?n.value:""};P.name=s("island-prop-name")||"",P.description=s("island-prop-description")||"";const e=s("island-prop-trait");P.dangerous=e==="dangerous",P.appealing=e==="appealing",P.treasureLevel=parseInt(s("island-prop-treasure"),10)||0,P.portType=s("island-prop-port")||"none",P.hazard=s("island-prop-hazard")||"none",P.faction=s("island-prop-faction")||"neutral",P.rumors=s("island-prop-rumors")||""}function Ru(s){const e=(s>>16&255).toString(16).padStart(2,"0"),t=(s>>8&255).toString(16).padStart(2,"0"),n=(s&255).toString(16).padStart(2,"0");return`#${e}${t}${n}`}function jt(){const s=document.getElementById("building-properties-empty"),e=document.getElementById("building-properties-content"),t=document.getElementById("building-prop-type"),n=document.getElementById("building-prop-id"),i=document.getElementById("building-prop-swatch"),r=document.getElementById("building-prop-position"),o=document.getElementById("building-prop-width"),a=document.getElementById("building-prop-height"),l=document.getElementById("building-prop-rotation"),c=document.getElementById("building-prop-cargo"),h=document.getElementById("building-prop-cargo-formula");if(!s||!e)return;if(!Ve){s.style.display="block",e&&(e.style.display="none");return}s.style.display="none",e&&(e.style.display="block");const u=sn(Ve.type),d=yn(Ve),p=Ve.cargoSize??d.width*d.height*10,g=Ve.rotation??0;t&&(t.textContent=(u==null?void 0:u.name)??Ve.type??"—"),n&&(n.textContent=Ve.id??"—"),i&&u&&(i.style.backgroundColor=Ru(u.color)),r&&(r.textContent=`Tile (${Ve.chunkX}, ${Ve.chunkY})`),o&&(o.value=d.width),a&&(a.value=d.height),l&&(l.textContent=`${g}°`),c&&(c.value=p),h&&(h.textContent=`${d.width}×${d.height} × 10 = ${d.width*d.height*10} units`)}function vn(){var i;if(!Qe||!(P!=null&&P.heightMap)){Z.detachPropGizmo();return}const s=P.config,e=(s==null?void 0:s.tileSize)??(s==null?void 0:s.chunkSize)??8,t=(s==null?void 0:s.tilesX)??Math.floor((((i=P.heightMap)==null?void 0:i.length)-1)/e),n=(s==null?void 0:s.tilesY)??t;Z.setPropGizmoAttached(Qe,{tileSize:e,tilesX:t,tilesY:n},P.heightMap)}function nn(){var _;const s=document.getElementById("prop-properties-empty"),e=document.getElementById("prop-properties-content"),t=document.getElementById("prop-prop-type"),n=document.getElementById("prop-prop-id"),i=document.getElementById("prop-prop-swatch"),r=document.getElementById("prop-prop-chunkX"),o=document.getElementById("prop-prop-chunkY"),a=document.getElementById("prop-prop-rotation-input"),l=document.getElementById("prop-prop-offsetX"),c=document.getElementById("prop-prop-offsetY"),h=document.getElementById("prop-prop-offsetZ"),u=document.getElementById("prop-prop-scale");if(!s||!e)return;if(!Qe){s.style.display="block",e.style.display="none";return}s.style.display="none",e.style.display="block";const d=Bn(Qe.type),p=Qe.rotation??0;t&&(t.textContent=(d==null?void 0:d.name)??Qe.type??"—"),n&&(n.textContent=Qe.id??"—"),i&&d&&(i.style.backgroundColor=Ru(d.color)),r&&(r.value=Qe.chunkX??0),o&&(o.value=Qe.chunkY??0),a&&(a.value=p),l&&(l.value=Qe.offsetX??0),c&&(c.value=Qe.offsetY??0),h&&(h.value=Qe.offsetZ??0),u&&(u.value=Qe.scale??1);const g=((_=Z.isGizmoSnapEnabled)==null?void 0:_.call(Z))??!1;document.querySelectorAll(".gizmo-snap-btn").forEach(m=>{m.dataset.snap=g?"on":"off",m.classList.toggle("active",g)})}function Cu(s){document.querySelectorAll("#prop-palette .prop-palette-btn").forEach(e=>{e.classList.toggle("selected",e.dataset.type===s)})}function Lu(s){return Array.isArray(s)?s.map(e=>{const t=yn(e),n={};return(e.width==null||e.height==null)&&(n.width=t.width,n.height=t.height),e.cargoSize==null&&(n.cargoSize=t.width*t.height*10),Object.keys(n).length?{...e,...n}:e}):s}function Ui(){var t;const s=(t=document.getElementById("contour-overlay"))==null?void 0:t.checked,e=Ce.getHeightMap()??(P==null?void 0:P.heightMap);e&&Z.setContourOverlay(!!s,e,.1)}function vx(){const s=Ce.getHeightMap();s&&(Ei.push(s.map(e=>[...e])),Ei.length>gx&&Ei.shift(),Ys=[])}function Iu(){if(Ei.length===0)return;Ys.push(Ce.getHeightMap().map(i=>[...i]));const s=Ei.pop();Ce.setHeightMap(s);const e=P==null?void 0:P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=P!=null&&P.pathTiles?new Set(P.pathTiles):new Set;Z.updateFromHeightMap(s,n,t),Ui()}function Du(){if(Ys.length===0)return;Ei.push(Ce.getHeightMap().map(i=>[...i]));const s=Ys.pop();Ce.setHeightMap(s);const e=P==null?void 0:P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=P!=null&&P.pathTiles?new Set(P.pathTiles):new Set;Z.updateFromHeightMap(s,n,t),Ui()}function xx(s){return Array.isArray(s)?s.map(e=>{const t=yn(e),n=e.cargoSize??t.width*t.height*10;return{...e,width:t.width,height:t.height,cargoSize:n}}):s}function Mx(){var c,h;if(!P)return;Pu();const s=((c=document.getElementById("save-mode"))==null?void 0:c.value)||"full",e=mt?J.getBuildings():P.buildings??[],t=xx(e),n=mt?Re.getProps():P.props??[],i={...P,heightMap:s==="full"?Ce.getHeightMap()??P.heightMap:void 0,display:{heightScale:(parseInt(document.getElementById("height-scale").value,10)||100)/100,wireframe:document.getElementById("wireframe").checked,shadows:((h=document.getElementById("shadows"))==null?void 0:h.checked)!==!1},buildings:s==="full"?t:[],props:s==="full"?n:[]},r=fx(i),o=new Blob([r],{type:"application/json"}),a=URL.createObjectURL(o),l=document.createElement("a");l.href=a,l.download=s==="config"?`yohoh-config-${Date.now()}.json`:`yohoh-island-${Date.now()}.json`,l.click(),URL.revokeObjectURL(a)}function Uu(s,e={},t=null){if(!s)return;const n=(a,l)=>{const c=document.getElementById(a);c&&(c.value=String(l))};n("grid-size",s.gridSize??1080),n("elevation-scale",Math.round((s.elevationScale??.96)/1.2*100)),n("terrain-roughness",Math.round((s.terrainRoughness??.7)*100)),n("island-radius",Math.round(((s.islandRadius??.62)-.2)/.6*100)),n("coast-falloff",Math.round((s.coastFalloff??3.5)*10)),n("coast-irregularity",Math.round((s.coastIrregularity??.25)*100)),n("elongation",Math.round((s.elongation??.8)*100)),n("sea-level",Math.round((s.seaLevel??.12)*100)),n("tile-size",s.tileSize??s.chunkSize??16),n("tile-variation",Math.round((s.tileVariation??0)*100)),n("noise-octaves",s.noiseOctaves??3),n("noise-frequency",Math.round((s.frequency??1)*10)),n("noise-persistence",Math.round((s.persistence??.75)*100)),n("noise-lacunarity",Math.round((s.lacunarity??2.6)*10)),n("path-width",Math.max(1,Math.min(5,s.pathWidth??1))),n("height-scale",Math.round((e.heightScale??.5)*100));const i=document.getElementById("wireframe");i&&(i.checked=!!e.wireframe);const r=document.getElementById("shadows");r&&(r.checked=e.shadows!==!1);const o=document.getElementById("seed");o&&(o.value=t!=null?String(t):""),Fu()}function Fu(){const s=(e,t,n=i=>i)=>{const i=document.getElementById(e),r=document.getElementById(t);i&&r&&(r.textContent=n(i.value))};s("grid-size","val-grid"),s("elevation-scale","val-elevation",e=>`${e}%`),s("terrain-roughness","val-roughness",e=>`${e}%`),s("island-radius","val-radius",e=>`${e}%`),s("coast-falloff","val-coast",e=>(parseInt(e,10)/10).toFixed(1)),s("coast-irregularity","val-coast-irreg",e=>`${e}%`),s("elongation","val-elongation",e=>`${e}%`),s("sea-level","val-sea",e=>(parseInt(e,10)/100).toFixed(2)),s("tile-size","val-tile"),s("tile-variation","val-tile-var",e=>`${e}%`),s("noise-octaves","val-octaves"),s("noise-frequency","val-freq",e=>(parseInt(e,10)/10).toFixed(1)),s("noise-persistence","val-persist",e=>(parseInt(e,10)/100).toFixed(2)),s("noise-lacunarity","val-lac",e=>(parseInt(e,10)/10).toFixed(1)),s("height-scale","val-height-scale",e=>`${e}%`),s("path-width","val-path-width"),s("brush-target","val-brush-target"),s("brush-strength","val-brush-strength",e=>`${((parseInt(e,10)||16)/40*20).toFixed(0)}%`)}function yx(){const s=document.createElement("input");s.type="file",s.accept=".json,application/json",s.onchange=e=>{var i;const t=(i=e.target.files)==null?void 0:i[0];if(!t)return;const n=new FileReader;n.onload=()=>{var r,o,a,l,c,h,u,d,p,g,_,m,f;try{const x=Au(n.result);Uu(x.config,x.display,x.seed);const v={...x.config,pathWidth:((r=x.config)==null?void 0:r.pathWidth)??1},M=Lu(x.buildings??[]);let y;if(x.heightMap?y={heightMap:x.heightMap,config:v,buildings:M,seed:x.seed,name:x.name??"",description:x.description??"",dangerous:x.dangerous??!1,appealing:x.appealing??!1,treasureLevel:x.treasureLevel??0,portType:x.portType??"none",hazard:x.hazard??"none",faction:x.faction??"neutral",rumors:x.rumors??""}:(y=xa(Na()),y.buildings=M,y.props=x.props??[],y.config={...y.config,pathWidth:v.pathWidth},y.name=x.name??y.name??"",y.description=x.description??y.description??"",y.dangerous=x.dangerous??y.dangerous??!1,y.appealing=x.appealing??y.appealing??!1,y.treasureLevel=x.treasureLevel??y.treasureLevel??0,y.portType=x.portType??y.portType??"none",y.hazard=x.hazard??y.hazard??"none",y.faction=x.faction??y.faction??"neutral",y.rumors=x.rumors??y.rumors??""),P=y,((o=y.buildings)==null?void 0:o.length)>=2){const{pathTiles:b,heightMap:w}=Di(y.buildings,y.heightMap,y.config);y.heightMap=w,y.pathTiles=[...b]}else y.pathTiles=[];if(Ce.setHeightMap(y.heightMap),Z.setConfig({heightScale:((a=x.display)==null?void 0:a.heightScale)??.5,wireframe:!!((l=x.display)!=null&&l.wireframe),shadows:((c=x.display)==null?void 0:c.shadows)!==!1}),Z.render(y),(h=y.buildings)!=null&&h.length){const b=((u=y.config)==null?void 0:u.tileSize)??((d=y.config)==null?void 0:d.chunkSize)??8,w=Math.floor((((p=y.heightMap)==null?void 0:p.length)-1)/b);Z.renderBuildings(y.buildings,y.heightMap,b,w,w)}if((g=y.props)!=null&&g.length){const b=((_=y.config)==null?void 0:_.tileSize)??((m=y.config)==null?void 0:m.chunkSize)??8,w=Math.floor((((f=y.heightMap)==null?void 0:f.length)-1)/b);Z.renderProps(y.props,y.heightMap,b,w,w)}Oa(y),za(),Ve=null,jt(),document.getElementById("seed").value=y.seed??"",Ms(!0),Ui()}catch(x){alert("Invalid island file: "+x.message)}},n.readAsText(t),s.value=""},s.click()}function Nt(s,e,t=n=>n){const n=document.getElementById(s),i=document.getElementById(e);if(!n||!i)return;const r=()=>{i.textContent=t(n.value)};n.addEventListener("input",r),n.addEventListener("change",r),r()}const xn=document.getElementById("settings-modal"),ta=document.getElementById("settings-btn"),na=document.getElementById("settings-close-btn");function Sx(){xn&&xn.classList.add("open")}function Ha(){xn&&xn.classList.remove("open")}ta==null||ta.addEventListener("click",Sx);na==null||na.addEventListener("click",Ha);xn==null||xn.addEventListener("click",s=>{s.target===xn&&Ha()});document.addEventListener("keydown",s=>{s.key==="Escape"&&(xn!=null&&xn.classList.contains("open"))&&Ha()});px.addEventListener("click",Ba);document.getElementById("randomize").addEventListener("click",()=>{document.getElementById("seed").value="",Ms(!1),Ba()});document.getElementById("save-btn").addEventListener("click",Mx);document.getElementById("load-btn").addEventListener("click",yx);async function Ex(){var t,n,i,r,o,a,l,c,h;const s=document.getElementById("preset-select"),e=s==null?void 0:s.value;if(e)try{const u=await fetch(e);if(!u.ok)throw new Error(u.statusText);const d=Au(await u.text());Uu(d.config,d.display,d.seed);const p={...d.config,pathWidth:((t=d.config)==null?void 0:t.pathWidth)??1},g=Lu(d.buildings??[]);let _;if(d.heightMap?_={heightMap:d.heightMap,config:p,buildings:g,seed:d.seed,name:d.name??"",description:d.description??"",dangerous:d.dangerous??!1,appealing:d.appealing??!1,treasureLevel:d.treasureLevel??0,portType:d.portType??"none",hazard:d.hazard??"none",faction:d.faction??"neutral",rumors:d.rumors??""}:(_=xa(Na()),_.buildings=g,_.config={..._.config,pathWidth:p.pathWidth},_.name=d.name??_.name??"",_.description=d.description??_.description??"",_.dangerous=d.dangerous??_.dangerous??!1,_.appealing=d.appealing??_.appealing??!1,_.treasureLevel=d.treasureLevel??_.treasureLevel??0,_.portType=d.portType??_.portType??"none",_.hazard=d.hazard??_.hazard??"none",_.faction=d.faction??_.faction??"neutral",_.rumors=d.rumors??_.rumors??""),P=_,((n=_.buildings)==null?void 0:n.length)>=2){const{pathTiles:m,heightMap:f}=Di(_.buildings,_.heightMap,_.config);_.heightMap=f,_.pathTiles=[...m]}else _.pathTiles=[];if(Ce.setHeightMap(_.heightMap),Z.setConfig({heightScale:((i=d.display)==null?void 0:i.heightScale)??.5,wireframe:!!((r=d.display)!=null&&r.wireframe),shadows:((o=d.display)==null?void 0:o.shadows)!==!1}),Z.render(_),(a=_.buildings)!=null&&a.length){const m=((l=_.config)==null?void 0:l.tileSize)??((c=_.config)==null?void 0:c.chunkSize)??8,f=Math.floor((((h=_.heightMap)==null?void 0:h.length)-1)/m);Z.renderBuildings(_.buildings,_.heightMap,m,f,f)}Oa(_),za(),Ve=null,jt(),Ms(!0),Ui(),s.value=""}catch(u){alert("Failed to load preset: "+u.message)}}document.getElementById("load-preset-btn").addEventListener("click",Ex);["island-prop-name","island-prop-description","island-prop-trait","island-prop-treasure","island-prop-port","island-prop-hazard","island-prop-faction","island-prop-rumors"].forEach(s=>{var e;(e=document.getElementById(s))==null||e.addEventListener("change",Pu)});function ka(){var g,_;if(!Ve||!P)return;const s=document.getElementById("building-prop-width"),e=document.getElementById("building-prop-height"),t=document.getElementById("building-prop-cargo");if(!s||!e||!t)return;const n=Math.max(1,Math.min(5,parseInt(s.value,10)||1)),i=Math.max(1,Math.min(5,parseInt(e.value,10)||1)),r=Math.max(10,parseInt(t.value,10)||10),o=mt?J.getBuildings():P.buildings??[];if(!J.canPlaceAtFootprint(Ve.chunkX,Ve.chunkY,n,i,Ve.type,{chunkX:Ve.chunkX,chunkY:Ve.chunkY})){jt();return}const l=Ve.width??yn(Ve).width,c=Ve.height??yn(Ve).height;if(Ve.width=n,Ve.height=i,Ve.cargoSize=r,n>l||i>c){J.flattenRegion(Ve.chunkX,Ve.chunkY,n,i,Ve.type);const m=J.heightMap;m&&(P.heightMap=m.map(f=>[...f]),Ce.setHeightMap(P.heightMap),J.onHeightMapChange&&J.onHeightMapChange(P.heightMap))}const h=P.config,u=(h==null?void 0:h.tileSize)??(h==null?void 0:h.chunkSize)??8,d=(h==null?void 0:h.tilesX)??Math.floor((((g=P.heightMap)==null?void 0:g.length)-1)/u),p=(h==null?void 0:h.tilesY)??d;if(o.length>=2&&P.heightMap){const{pathTiles:m,heightMap:f}=Di(o,P.heightMap,{...h,tilesX:d,tilesY:p});P.heightMap=f,P.pathTiles=[...m],Ce.setHeightMap(f),(_=J.setHeightMap)==null||_.call(J,f),Z.updateFromHeightMap(f,m,u)}else Z.updateFromHeightMap(P.heightMap,P.pathTiles?new Set(P.pathTiles):new Set,u);Z.renderBuildings(o,P.heightMap,u,d,p),mt&&J.onBuildingsChange&&J.onBuildingsChange(o)}var ch;(ch=document.getElementById("building-prop-width"))==null||ch.addEventListener("change",ka);var hh;(hh=document.getElementById("building-prop-height"))==null||hh.addEventListener("change",ka);var uh;(uh=document.getElementById("building-prop-cargo"))==null||uh.addEventListener("change",ka);var dh;(dh=document.getElementById("building-rotate-btn"))==null||dh.addEventListener("click",()=>{var l;if(!Ve||!P||!sn(Ve.type))return;const e=[0,90,180,270],t=e.indexOf(Ve.rotation??0);Ve.rotation=e[(t+1)%4];const n=mt?J.getBuildings():P.buildings??[],i=P.config,r=(i==null?void 0:i.tileSize)??(i==null?void 0:i.chunkSize)??8,o=(i==null?void 0:i.tilesX)??Math.floor((((l=P.heightMap)==null?void 0:l.length)-1)/r),a=(i==null?void 0:i.tilesY)??o;Z.renderBuildings(n,P.heightMap,r,o,a),mt&&J.onBuildingsChange&&J.onBuildingsChange(n)});var fh;(fh=document.getElementById("building-remove-btn"))==null||fh.addEventListener("click",()=>{var r;if(!Ve||!P)return;const s=(P.buildings??[]).filter(o=>o!==Ve);P.buildings=s,mt?J.setBuildings(s):J.setBuildings(s,{shared:!0}),Ve=null,jt(),nn();const e=P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=(e==null?void 0:e.tilesX)??Math.floor((((r=P.heightMap)==null?void 0:r.length)-1)/t),i=(e==null?void 0:e.tilesY)??n;if(s.length>=2&&P.heightMap){const{pathTiles:o,heightMap:a}=Di(s,P.heightMap,{...e,tilesX:n,tilesY:i});P.heightMap=a,P.pathTiles=[...o],Ce.setHeightMap(a),Z.updateFromHeightMap(a,o,t)}else P.pathTiles=[],Z.updateFromHeightMap(P.heightMap,new Set,t);Z.renderBuildings(s,P.heightMap,t,n,i),mt&&J.onBuildingsChange&&J.onBuildingsChange(s)});document.getElementById("edit-mode-btn").addEventListener("click",()=>{Ms(!yi)});var ph;(ph=document.getElementById("build-mode-btn"))==null||ph.addEventListener("click",()=>{no(!mt)});document.querySelectorAll('input[name="place-mode"]').forEach(s=>{s.addEventListener("change",e=>{Si=e.target.value,mt&&no(!0);const t=document.getElementById("place-buildings-panel"),n=document.getElementById("place-props-panel");Si==="buildings"?(t&&(t.style.display="block"),n&&(n.style.display="none")):(t&&(t.style.display="none"),n&&(n.style.display="block"))})});document.querySelectorAll("#prop-palette .prop-palette-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.type;e&&(Re.setSelectedType(e),Cu(e),ei())})});var mh;(mh=document.getElementById("prop-rotate-btn"))==null||mh.addEventListener("click",()=>{var a;if(!Qe||!P)return;const s=[0,90,180,270],e=s.indexOf(Qe.rotation??0);Qe.rotation=s[(e+1)%4];const t=mt?Re.getProps():P.props??[],n=P.config,i=(n==null?void 0:n.tileSize)??(n==null?void 0:n.chunkSize)??8,r=(n==null?void 0:n.tilesX)??Math.floor((((a=P.heightMap)==null?void 0:a.length)-1)/i),o=(n==null?void 0:n.tilesY)??r;Z.renderProps(t,P.heightMap,i,r,o),mt&&Re.onPropsChange&&Re.onPropsChange(t),P={...P,props:t},nn()});var gh;(gh=document.getElementById("prop-remove-btn"))==null||gh.addEventListener("click",()=>{var r;if(!Qe||!P)return;const s=(P.props??[]).filter(o=>o!==Qe);P={...P,props:s},mt&&Re.setProps(s),Qe=null,vn(),nn();const e=P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=(e==null?void 0:e.tilesX)??Math.floor((((r=P.heightMap)==null?void 0:r.length)-1)/t),i=(e==null?void 0:e.tilesY)??n;Z.renderProps(s,P.heightMap,t,n,i)});function bx(){var f,x,v,M,y,b,w,U,S,E,L;if(!Qe||!P)return;const s=P.config,e=(s==null?void 0:s.tileSize)??(s==null?void 0:s.chunkSize)??8,t=(s==null?void 0:s.tilesX)??Math.floor((((f=P.heightMap)==null?void 0:f.length)-1)/e),n=(s==null?void 0:s.tilesY)??t,i=((x=P.heightMap)==null?void 0:x.length)-1;s==null||s.seaLevel;const r=Math.max(0,Math.min(t-1,parseInt((v=document.getElementById("prop-prop-chunkX"))==null?void 0:v.value,10)??Qe.chunkX)),o=Math.max(0,Math.min(n-1,parseInt((M=document.getElementById("prop-prop-chunkY"))==null?void 0:M.value,10)??Qe.chunkY)),a=Math.max(0,Math.min(360,parseInt((y=document.getElementById("prop-prop-rotation-input"))==null?void 0:y.value,10)??Qe.rotation??0)),l=parseFloat((b=document.getElementById("prop-prop-offsetX"))==null?void 0:b.value)||0,c=parseFloat((w=document.getElementById("prop-prop-offsetY"))==null?void 0:w.value)||0,h=Math.max(-.5,Math.min(.5,parseFloat((U=document.getElementById("prop-prop-offsetZ"))==null?void 0:U.value)||0)),u=Math.max(.25,Math.min(100,parseFloat((S=document.getElementById("prop-prop-scale"))==null?void 0:S.value)||1)),d=Math.min(i,Math.floor((r+.5)*e)),p=Math.min(i,Math.floor((o+.5)*e));(L=(E=P.heightMap)==null?void 0:E[p])==null||L[d],(P.buildings??[]).some(F=>{const z=F.width??1,D=F.height??1;return r>=F.chunkX&&r<F.chunkX+z&&o>=F.chunkY&&o<F.chunkY+D});const _=P.props??[];_.find(F=>F!==Qe&&F.chunkX===r&&F.chunkY===o),Qe.chunkX=r,Qe.chunkY=o,Qe.rotation=a,Qe.offsetX=l,Qe.offsetY=c,Qe.offsetZ=h,Qe.scale=u;const m=mt?Re.getProps():_;mt&&Re.setProps(m),P={...P,props:m},Z.renderProps(P.props,P.heightMap,e,t,n),vn(),nn()}["prop-prop-chunkX","prop-prop-chunkY","prop-prop-rotation-input","prop-prop-offsetX","prop-prop-offsetY","prop-prop-offsetZ","prop-prop-scale"].forEach(s=>{var e;(e=document.getElementById(s))==null||e.addEventListener("change",bx)});document.querySelectorAll(".gizmo-mode-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.mode;e&&(Z.setGizmoMode(e),document.querySelectorAll(".gizmo-mode-btn").forEach(t=>t.classList.toggle("active",t.dataset.mode===e)))})});document.querySelectorAll(".gizmo-space-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.space==="world"?"local":"world";Z.setGizmoSpace(e),s.dataset.space=e,s.textContent=e.charAt(0).toUpperCase()+e.slice(1)})});document.querySelectorAll(".gizmo-snap-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.snap!=="on";Z.setGizmoSnap(e),s.dataset.snap=e?"on":"off",s.classList.toggle("active",e)})});var _h;(_h=document.getElementById("building-type"))==null||_h.addEventListener("change",s=>{J.setSelectedType(s.target.value),Va(s.target.value),Ga(s.target.value),qs(),ei()});document.querySelectorAll("#building-palette .building-palette-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.type;if(!e)return;J.setSelectedType(e);const t=document.getElementById("building-type");t&&(t.value=e),Va(e),Ga(e),qs(),ei()})});function Ga(s){const e=$n(s),t=document.getElementById("building-width"),n=document.getElementById("building-height");t&&(t.value=e.width),n&&(n.value=e.height)}var vh;(vh=document.getElementById("building-width"))==null||vh.addEventListener("change",s=>{var n;const e=J==null?void 0:J.selectedType;if(!e)return;const t=Math.max(1,Math.min(5,parseInt(s.target.value,10)||1));if(fu(e,t,void 0),P&&mt){const i=P.config,r=(i==null?void 0:i.tileSize)??(i==null?void 0:i.chunkSize)??8,o=(i==null?void 0:i.tilesX)??Math.floor((((n=P.heightMap)==null?void 0:n.length)-1)/r),a=(i==null?void 0:i.tilesY)??o;Z.renderBuildings(J.getBuildings(),P.heightMap,r,o,a)}});var xh;(xh=document.getElementById("building-height"))==null||xh.addEventListener("change",s=>{var n;const e=J==null?void 0:J.selectedType;if(!e)return;const t=Math.max(1,Math.min(5,parseInt(s.target.value,10)||1));if(fu(e,void 0,t),P&&mt){const i=P.config,r=(i==null?void 0:i.tileSize)??(i==null?void 0:i.chunkSize)??8,o=(i==null?void 0:i.tilesX)??Math.floor((((n=P.heightMap)==null?void 0:n.length)-1)/r),a=(i==null?void 0:i.tilesY)??o;Z.renderBuildings(J.getBuildings(),P.heightMap,r,o,a)}});function Va(s){document.querySelectorAll("#building-palette .building-palette-btn").forEach(e=>{e.classList.toggle("selected",e.dataset.type===s)})}var Mh;(Mh=document.getElementById("show-grid-overlay"))==null||Mh.addEventListener("change",s=>{var r,o;if(!P)return;const e=P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=(e==null?void 0:e.tilesX)??Math.floor((((r=P.heightMap)==null?void 0:r.length)-1)/t),i=(e==null?void 0:e.tilesY)??n;Z.setTileGridOverlay(s.target.checked,n,i,((o=P.heightMap)==null?void 0:o.length)-1)});document.querySelectorAll(".brush-tool-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.mode;e&&(document.getElementById("brush-mode").value=e,Ce.setBrushMode(e),document.querySelectorAll(".brush-tool-btn").forEach(t=>t.setAttribute("aria-pressed",t.dataset.mode===e?"true":"false")))})});document.getElementById("brush-mode").addEventListener("change",s=>{const e=s.target.value;Ce.setBrushMode(e),document.querySelectorAll(".brush-tool-btn").forEach(t=>t.setAttribute("aria-pressed",t.dataset.mode===e?"true":"false"))});document.getElementById("brush-target").addEventListener("input",s=>{const e=parseFloat(s.target.value);isNaN(e)||Ce.setBrushTargetHeight(e)});document.getElementById("brush-target").addEventListener("change",s=>{const e=parseFloat(s.target.value);isNaN(e)||Ce.setBrushTargetHeight(e)});var yh;(yh=document.getElementById("brush-size-tiles"))==null||yh.addEventListener("change",s=>{Ce.setBrushSizeInTiles(parseInt(s.target.value,10)||1)});var Sh;(Sh=document.getElementById("brush-apply-mode"))==null||Sh.addEventListener("change",s=>{Ce.setApplyOnClickOnly(s.target.value==="click")});document.getElementById("brush-strength").addEventListener("input",s=>{const e=parseInt(s.target.value,10)||16;Ce.setBrushStrength(e/40*.2)});document.querySelectorAll(".level-preset-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.level,t=cx[e];if(t!=null){const n=document.getElementById("brush-target");n&&(n.value=t.toFixed(2),Ce.setBrushTargetHeight(t),Fu())}})});document.getElementById("undo-btn").addEventListener("click",Iu);document.getElementById("redo-btn").addEventListener("click",Du);var Eh;(Eh=document.getElementById("contour-overlay"))==null||Eh.addEventListener("change",()=>{Ui()});var bh;(bh=document.getElementById("elev-min"))==null||bh.addEventListener("change",()=>{const s=parseFloat(document.getElementById("elev-min").value)||0,e=parseFloat(document.getElementById("elev-max").value)??1;Ce.setElevationClamp(s,e)});var wh;(wh=document.getElementById("elev-max"))==null||wh.addEventListener("change",()=>{const s=parseFloat(document.getElementById("elev-min").value)||0,e=parseFloat(document.getElementById("elev-max").value)??1;Ce.setElevationClamp(s,e)});document.addEventListener("keydown",s=>{var t,n,i,r,o,a;if((n=(t=document.activeElement)==null?void 0:t.closest)!=null&&n.call(t,"input, textarea, select"))return;const e=s.key.toLowerCase();if(Qe&&!s.ctrlKey&&!s.metaKey&&!s.altKey){if(e==="w"){s.preventDefault(),Z.setGizmoMode("translate"),document.querySelectorAll(".gizmo-mode-btn").forEach(l=>l.classList.toggle("active",l.dataset.mode==="translate"));return}if(e==="e"){s.preventDefault(),Z.setGizmoMode("rotate"),document.querySelectorAll(".gizmo-mode-btn").forEach(l=>l.classList.toggle("active",l.dataset.mode==="rotate"));return}if(e==="r"){s.preventDefault(),Z.setGizmoMode("scale"),document.querySelectorAll(".gizmo-mode-btn").forEach(l=>l.classList.toggle("active",l.dataset.mode==="scale"));return}if(e==="q"){s.preventDefault();const l=document.querySelector(".gizmo-space-btn");if(l){const c=l.dataset.space==="world"?"local":"world";Z.setGizmoSpace(c),l.dataset.space=c,l.textContent=c.charAt(0).toUpperCase()+c.slice(1)}return}if(e==="x"){s.preventDefault();const l=!((i=Z.isGizmoSnapEnabled)!=null&&i.call(Z));(r=Z.setGizmoSnap)==null||r.call(Z,l),document.querySelectorAll(".gizmo-snap-btn").forEach(c=>{c.dataset.snap=l?"on":"off",c.classList.toggle("active",l)});return}if(e==="escape"){s.preventDefault(),Qe=null,(o=Z.clearPropHighlight)==null||o.call(Z),vn(),nn(),jt();return}}if(e==="e"&&!s.ctrlKey&&!s.metaKey&&!s.altKey){s.preventDefault(),Ms(!yi);return}if(yi){if(e==="z"&&!s.shiftKey&&(s.ctrlKey||s.metaKey)){s.preventDefault(),Iu();return}if((e==="y"||e==="z"&&s.shiftKey)&&(s.ctrlKey||s.metaKey)){s.preventDefault(),Du();return}if(e==="b"&&!s.ctrlKey&&!s.metaKey){s.preventDefault();const l=document.getElementById("brush-size-tiles");if(l){const c=["1","2","3","4","5"],h=c.indexOf(l.value);l.value=c[(h+1)%c.length],Ce.setBrushSizeInTiles(parseInt(l.value,10)||1)}return}if(e==="Escape"){Ce.rampPointA&&(s.preventDefault(),Ce.rampPointA=null,Ce.setBrushMode(Ce.brushMode),(a=Z._clearRampPreview)==null||a.call(Z));return}if(e>="1"&&e<="8"){s.preventDefault();const c=["raise","lower","flatten","absolute","set","plateau","smooth","ramp"][parseInt(e,10)-1];document.getElementById("brush-mode").value=c,Ce.setBrushMode(c),document.querySelectorAll(".brush-tool-btn").forEach(h=>h.setAttribute("aria-pressed",h.dataset.mode===c?"true":"false"))}}});document.getElementById("height-scale").addEventListener("input",()=>{const s=(parseInt(document.getElementById("height-scale").value,10)||100)/100;if(Z.setConfig({heightScale:s}),P){const e=P==null?void 0:P.config,t=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8,n=P!=null&&P.pathTiles?new Set(P.pathTiles):new Set;Z.updateFromHeightMap(Ce.getHeightMap()??P.heightMap,n,t)}});var Th;(Th=document.getElementById("path-width"))==null||Th.addEventListener("change",()=>{var t,n,i;if(!P)return;const s=Math.max(1,Math.min(5,parseInt((t=document.getElementById("path-width"))==null?void 0:t.value,10)||1)),e={...P.config,pathWidth:s};if(P.config=e,((n=P.buildings)==null?void 0:n.length)>=2){const r=P.heightMap.map(c=>[...c]),{pathTiles:o,heightMap:a}=Di(P.buildings,r,e);P.heightMap=a,P.pathTiles=[...o],Ce.setHeightMap(a),(i=J.setHeightMap)==null||i.call(J,a);const l=(e==null?void 0:e.tileSize)??(e==null?void 0:e.chunkSize)??8;Z.updateFromHeightMap(a,o,l)}});var Ah;(Ah=document.getElementById("connectivity-check"))==null||Ah.addEventListener("change",s=>{var e;J.connectivityCheckEnabled=!!((e=s.target)!=null&&e.checked)});var Ph;(Ph=document.getElementById("zone-hints"))==null||Ph.addEventListener("change",()=>{qs()});document.getElementById("wireframe").addEventListener("change",s=>{if(Z.setConfig({wireframe:s.target.checked}),P){const e=Z.getMesh();e&&(e.material.wireframe=s.target.checked)}});var Rh;(Rh=document.getElementById("shadows"))==null||Rh.addEventListener("change",s=>{Z.setConfig({shadows:s.target.checked})});Nt("grid-size","val-grid");Nt("elevation-scale","val-elevation",s=>`${s}%`);Nt("terrain-roughness","val-roughness",s=>`${s}%`);Nt("island-radius","val-radius",s=>`${s}%`);Nt("coast-falloff","val-coast",s=>(parseInt(s,10)/10).toFixed(1));Nt("coast-irregularity","val-coast-irreg",s=>`${s}%`);Nt("elongation","val-elongation",s=>`${s}%`);Nt("sea-level","val-sea",s=>(parseInt(s,10)/100).toFixed(2));Nt("tile-size","val-tile");Nt("tile-variation","val-tile-var",s=>`${s}%`);Nt("noise-octaves","val-octaves");Nt("noise-frequency","val-freq",s=>(parseInt(s,10)/10).toFixed(1));Nt("noise-persistence","val-persist",s=>(parseInt(s,10)/100).toFixed(2));Nt("noise-lacunarity","val-lac",s=>(parseInt(s,10)/10).toFixed(1));Nt("height-scale","val-height-scale",s=>`${s}%`);Nt("path-width","val-path-width");Nt("brush-target","val-brush-target");Nt("brush-strength","val-brush-strength",s=>`${((parseInt(s,10)||16)/40*20).toFixed(0)}%`);Ba();
