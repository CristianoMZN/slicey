import { defineBoot } from '#q-app/wrappers';
import { initializePushContext } from 'src/services/push.service';

export default defineBoot(() => {
  void initializePushContext();
});
