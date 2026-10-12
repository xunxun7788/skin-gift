import { ref } from "vue";

const sound = ref((localStorage.getItem("sound") ?? "1") == "1");

var cdnUrl = "";

export default function () {
  function changeSound() {
    sound.value = !sound.value;
    localStorage.setItem("sound", sound.value ? "1" : "0");
  }
  return {
    sound,
    cdnUrl,
    changeSound,
  };
}
