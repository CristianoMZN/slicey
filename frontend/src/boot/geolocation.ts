import { defineBoot } from '#q-app/wrappers';
import { ensureGeolocationForApi } from 'src/services/geolocation.service';

export default defineBoot(() => {
  void ensureGeolocationForApi();
});
