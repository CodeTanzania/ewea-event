#### 0.3.0 (2019-12-09)

##### Chores

* **examples:**  add changelog ([7ea6cce0](https://github.com/codetanzania/ewea-event/commit/7ea6cce06c4b0fe391546ea717be52b14b141cec))
* **deps:**  force latest version & audit fix ([b86477ee](https://github.com/codetanzania/ewea-event/commit/b86477ee58bea4b26a83ba51400158bdc9c96e28))

##### Documentation Changes

*  update requirements version ([573203e3](https://github.com/codetanzania/ewea-event/commit/573203e3dbafb18c1fba92003d123551e7894247))
*  update test coverage badge ([8d6ee388](https://github.com/codetanzania/ewea-event/commit/8d6ee388659bd50e239fdfaaa5f5a07b709ef65f))

##### New Features

* **changelog:**
  *  implement http router ([26735b12](https://github.com/codetanzania/ewea-event/commit/26735b12edc1f40e5cac476386c5dd135812d8e7))
  *  add indicator, need, effect, value & unit fields ([3ad8a0ce](https://github.com/codetanzania/ewea-event/commit/3ad8a0ce830359808f985c438c8a6bbbf2e27fef))
  *  add comment schema field ([b41cbab1](https://github.com/codetanzania/ewea-event/commit/b41cbab15b9b01232c13abc57e6127da778f9679))
  *  add administrative areas, location and address fields ([22dc9408](https://github.com/codetanzania/ewea-event/commit/22dc9408a3ecd5a08437bd8f33aa5a2554150e5e))
  *  add party groups and roles schema fields ([3b55b8c9](https://github.com/codetanzania/ewea-event/commit/3b55b8c962203900a1777c9f99a3755d53e6409c))
  *  add agencies and focals schema fields ([e495e182](https://github.com/codetanzania/ewea-event/commit/e495e1820a641530f2b36a9aa0d0cd9606b0f4e6))
  *  add initiator and verifier schema fields ([8cab72fd](https://github.com/codetanzania/ewea-event/commit/8cab72fd62a6d71f892fd9a40f98696c3865c9a5))
  *  add function and action schema fields ([63de15d3](https://github.com/codetanzania/ewea-event/commit/63de15d32338046d4da946970c47ea732946b21f))
  *  add use field ([5bef60d9](https://github.com/codetanzania/ewea-event/commit/5bef60d99ec9eeb58996d28abb158f3333c58558))
  *  add image, audio, video, document file fields ([134669cf](https://github.com/codetanzania/ewea-event/commit/134669cf25c17931f53521c9511b342144aee4b6))
  *  add group, type & event schema fields ([aa66172c](https://github.com/codetanzania/ewea-event/commit/aa66172c14d6a5c57536fd40bce14a4a693a4d9c))
  *  initialize model ([cb621716](https://github.com/codetanzania/ewea-event/commit/cb621716d41a411855223d73622f8a4686ebe53b))
* **schema:**
  *  add value, effect and need fields ([31bcca0e](https://github.com/codetanzania/ewea-event/commit/31bcca0e1490f99bbe6947977351231f41b70028))
  *  add questio to base ([22eded90](https://github.com/codetanzania/ewea-event/commit/22eded902d7c632834bafbdd612dbd635937edf3))
  *  add indicator and unit to base schema ([89b64b6b](https://github.com/codetanzania/ewea-event/commit/89b64b6b9f505dd7e1a5708a3cfab445b1195b01))
  *  add geos fields ([8fa7a66f](https://github.com/codetanzania/ewea-event/commit/8fa7a66f362955fe9cfb9f611d746c837b849a87))
  *  add groups and roles to parties schema ([3976bf50](https://github.com/codetanzania/ewea-event/commit/3976bf503a3a4da815cb6bdf83d436da23c25ffc))
  *  add agencies and focal to parties schema ([a3c06552](https://github.com/codetanzania/ewea-event/commit/a3c06552e6b0c4ee90846c4a2352c80550939a1d))
  *  add initiator & verifier on parties schema ([73c08ced](https://github.com/codetanzania/ewea-event/commit/73c08ced58310127599875d32b285c8b647116e2))
  *  add function and action on base schema ([25af8c08](https://github.com/codetanzania/ewea-event/commit/25af8c08c23a35df6355b44cb7f0c4b32c8101ec))
  *  add common file schema definition ([c7837943](https://github.com/codetanzania/ewea-event/commit/c7837943f8ca9e87aef43da030041b537528082c))
* **event:**  update aggegatable field options ([2dab98fc](https://github.com/codetanzania/ewea-event/commit/2dab98fca9ace2f842fd399fbd01951995738380))

##### Refactors

* **model:**  use join helper on exportables ([3551e5ad](https://github.com/codetanzania/ewea-event/commit/3551e5ad41acb69e4cca585e6c31b3657644be79))
* **schema:**  extract base schema ([5dda6f30](https://github.com/codetanzania/ewea-event/commit/5dda6f3045dacb6401aca8eefd7c5e3e6184bc64))
* **event:**  extract constants to internals ([05da9759](https://github.com/codetanzania/ewea-event/commit/05da9759aa02ed24bf6e99775699ccff6546e690))

##### Code Style Changes

* **jsdocs:**  improve examples ([b73dfc27](https://github.com/codetanzania/ewea-event/commit/b73dfc2733dba8d4900e2927837737c0136c9f3b))
* **changelog:**  improve docs ([6ac77a1a](https://github.com/codetanzania/ewea-event/commit/6ac77a1ad2a535817541d0836e3975265e62c92d))
* **event:**
  *  improve field examples ([f5d4a8d6](https://github.com/codetanzania/ewea-event/commit/f5d4a8d6ccdfbc474377443c9991a61ad11cf24f))
  *  clear inline todos ([40e5b89c](https://github.com/codetanzania/ewea-event/commit/40e5b89ca275cda5e7df4ffe94d9a6366b82bc00))
* **model:**  update fields documentation ([e7370c0c](https://github.com/codetanzania/ewea-event/commit/e7370c0ca6bf327e600444f65e2dc42250523d3b))

#### 0.2.0 (2019-12-05)

##### Chores

* **seed:**  add event instruction ([8eb7c7a1](https://github.com/codetanzania/ewea-event/commit/8eb7c7a167b42371bfe948faf07c96b1fdc8c7ce))

##### New Features

* **model:**
  *  add sequenceable options to event ([9a1fee60](https://github.com/codetanzania/ewea-event/commit/9a1fee607977bb8978f46cdddf354d309c6fc950))
  *  add address & location event fields ([4f8a38e4](https://github.com/codetanzania/ewea-event/commit/4f8a38e4bbd81b6e30fc21e8219286dd4df75638))
  *  add administrative areas event field ([85eecc52](https://github.com/codetanzania/ewea-event/commit/85eecc527dd09659d7e12f019cd5a35b7c85ca44))
  *  add places event field ([9d82b840](https://github.com/codetanzania/ewea-event/commit/9d82b840ddceee29ced8157b952470a0dda08b27))
  *  add interventions event field ([a80fe5ab](https://github.com/codetanzania/ewea-event/commit/a80fe5abd675d0a792b367adb2d3d47ff03103a6))
  *  add remarks field ([d940e3f7](https://github.com/codetanzania/ewea-event/commit/d940e3f7889a6d4fa849ea8cd26af989e485ef69))
  *  add event stage field ([a4998804](https://github.com/codetanzania/ewea-event/commit/a4998804a7d3c3d66fba0bf0fb4c827c5eeaf0b4))
  *  add event certainty field ([2e48d36b](https://github.com/codetanzania/ewea-event/commit/2e48d36b3b6ccc6e31d2941cac8f24601179003c))
  *  add instruction field ([eef08ec4](https://github.com/codetanzania/ewea-event/commit/eef08ec465fe33bc37dbd18d719bf2193c607690))
  *  add event cause ([0001a0df](https://github.com/codetanzania/ewea-event/commit/0001a0dfc8ab45b7005f9dad20e08f6bcbe7aa0c))

#### 0.1.0 (2019-12-04)

##### Chores

* **examples:**  restore sample app ([db8ecef6](https://github.com/codetanzania/ewea-event/commit/db8ecef69ef1ba842778b56d55ff249004eea453))
* **deps:**  force latest version & audit fix ([226243c3](https://github.com/codetanzania/ewea-event/commit/226243c34b730054157f3bc1e68e8427904b7298))
*  initial setup ([a3baf74d](https://github.com/codetanzania/ewea-event/commit/a3baf74d518a93ebe9b629a650a8972e1cd44967))

##### Documentation Changes

* **readme:**  set default branch to develop ([d510655e](https://github.com/codetanzania/ewea-event/commit/d510655e71e25b258040345eb9c704e071d038eb))

##### New Features

* **model:**
  *  implement seeding ([1877e583](https://github.com/codetanzania/ewea-event/commit/1877e58344fbc38110e2ceba608b208a5932922a))
  *  add prepare see & pre validate hook ([9446e066](https://github.com/codetanzania/ewea-event/commit/9446e066b854949584c3ec7227c96cdced1f633e))
  *  add end date field ([7c54fe8a](https://github.com/codetanzania/ewea-event/commit/7c54fe8a8e6d899d64b0f718256778061656bb45))
  *  add started date field ([abd94278](https://github.com/codetanzania/ewea-event/commit/abd942783d4d224624eca316fc82a877426cf59e))
  *  add description field ([5452616b](https://github.com/codetanzania/ewea-event/commit/5452616b33f6b6c4ede42bcdfcce2373f7d60c0f))
  *  add number field ([20a04694](https://github.com/codetanzania/ewea-event/commit/20a04694fd6c2044916e6f43d80f11719a50c48b))
  *  add event type field ([aa7cf8e4](https://github.com/codetanzania/ewea-event/commit/aa7cf8e4eb43124d57f3444babc213597e386218))
  *  add event group ([980486d1](https://github.com/codetanzania/ewea-event/commit/980486d1969400013542d8c73c14e7b5b46a811f))
* **router:**  implement http handlers ([a1a9cc3a](https://github.com/codetanzania/ewea-event/commit/a1a9cc3a98f7aa1beb54b800365e85610b9705ed))

