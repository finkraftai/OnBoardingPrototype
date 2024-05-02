import React from 'react'
import TablePage from './components/WorkSpace/TablePage'
import { Route, Routes } from 'react-router-dom'
import UpdateForm from './components/WorkSpace/UpdateForm'
import CreateForm from './components/WorkSpace/CreateForm'
import ClusterForm from './components/Cluster-ws/ClusterForm'
import ClusterTable from './components/Cluster-ws/ClusterTable'
import UserCluster from './components/User-cluster/UserCluster'
import UpdateCluster from './components/Cluster-ws/UpdateCluster'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/workspaces' Component={TablePage}/>
        <Route path='/UpdateForm/:workspaceId' Component={UpdateForm}/>
        <Route path='/createworkspace' Component={CreateForm}/>
        <Route path='/clusters' Component={ClusterTable}/>
        <Route path='/createcluster' Component={ClusterForm}/>
        <Route path='/updatecluster/:id' Component={UpdateCluster}/>
        <Route path='/usercluster' Component={UserCluster}/>
      </Routes>
    </div>
  )
}

export default App