<script>
</script>


<template>
    <div class = "new-log">
        <svg xmlns="http://www.w3.org/2000/svg" class = "new-log-logo" viewBox="0 0 576 512"><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 48-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16s16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0 0-48z"/></svg>
        <h2>New log registered</h2>
    </div>
</template>

<style scoped>
.new-log{
    padding: 1vw;
    display: flex;
    justify-content: space-around;
    position: fixed;
    color: white;
    border-radius: 5px;
    width: 15vw;
    z-index: 1000;
    bottom: 2vw;
    right: 2vw;
    transition: opacity 1s ease;
    background-color: rgba(79, 193, 79, 0.881);
}
.new-log-logo{
    width: 2vw;
    fill: white;
}
</style>