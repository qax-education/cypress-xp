import React from 'react';
import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import OrphanagesMap from './pages/OrphanagesMap';
import Orphanage from './pages/Orphanage';
import CreateOrphanage from './pages/CreateOrphanage';
import NotFound from './pages/NotFound';

function Routes() {
    return (<BrowserRouter>
      <Switch>
        <Route path="/" element={<Landing />}/>
        <Route path="/map" element={<OrphanagesMap />}/>

        <Route path="/orphanages/create" element={<CreateOrphanage />}/>
        <Route path="/orphanages/:_id" element={<Orphanage />}/>

        <Route path="*" element={<NotFound />}/>
      </Switch>
    </BrowserRouter>);
}
export default Routes;
