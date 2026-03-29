declare module 'vue-undraw/*' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<
    {
      primaryColor?: string;
      secondaryColor?: string;
      primarycolor?: string;
      secondarycolor?: string;
    },
    object,
    unknown
  >;

  export default component;
}
