const Cookies = {
  get(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },


  set(cname, cvalue, exyears) {
    let d = new Date();
    d.setTime(d.getTime() + (exyears * 24 * 60 * 60 * 1000 * 365));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
}

/*
#FFFFFF
#BE0039
#FF4500
#FFA800
#FFD635
#00A368
#00CC78
#7EED56
#00756F
#009EAA
#2450A4
#3690EA
#51E9F4
#493AC1
#6A5CFF
#811E9F
#B44AC0
#FF3881
#FF99AA
#6D482F
#9C6926
#000000
#898D90
#D4D7D9
*/

const Color = {
  pixelStateToColor(state){
    switch(state){
      case 0: return '#ffffff';
      case 1: return '#be0039';
      case 2: return '#ff4500';
      case 3: return '#ffa800';
      case 4: return '#ffd635';
      case 5: return '#00a368';
      case 6: return '#00cc78';
      case 7: return '#7eed56';
      case 8: return '#00756f';
      case 9: return '#009eaa';
      case 10: return '#2450a4';
      case 11: return '#3690ea';
      case 12: return '#51e9f4';
      case 13: return '#493ac1';
      case 14: return '#6a5cff';
      case 15: return '#811e9f';
      case 16: return '#b44ac0';
      case 17: return '#ff3881';
      case 18: return '#ff99aa';
      case 19: return '#6d482f';
      case 20: return '#9c6926';
      case 21: return '#000000';
      case 22: return '#898d90';
      case 23: return '#d4d7d9';
      case 24: return '#FF2727';
      case 25: return '#DBCAB0';
      case 26: return '#323232';
      case 27: return '#FF782C';
      case 28: return '#297D00';
      case 29: return '#964B00';
      default: return '#ffffff';
    }
  }
}


const Vec2 = {
  lerp(origin, dest, t){
    t = Math.max(0, Math.min(1, t));
    return {
      x: origin.x + (dest.x - origin.x) * t,
      y: origin.y + (dest.y - origin.y) * t
    }
  }
}