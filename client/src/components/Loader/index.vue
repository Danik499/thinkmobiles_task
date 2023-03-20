<template>
    <div>
      <circles-to-rhombuses-spinner
        :animation-duration="1200"
        :circles-num="3"
        :circle-size="15"
        :color="'black'"
      />
    </div>
  </template>
  
  <script>
  // To use minified css and js files instead of .vue single file components:
  // import 'epic-spinners/dist/lib/epic-spinners.min.css'
  // import {AtomSpinner} from 'epic-spinners/dist/lib/epic-spinners.min.js'
  // To get tree shaking from webpack (won't import all spinners when you only need one)
  // import AtomSpinner from 'epic-spinners/src/components/lib/AtomSpinner'
  import { CirclesToRhombusesSpinner } from "epic-spinners";
  export default {
    name: "Loader",
    components: {
      CirclesToRhombusesSpinner
    }
  };
  </script>