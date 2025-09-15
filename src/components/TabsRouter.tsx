import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import {
    Link,
    matchPath,
    useLocation,
} from 'react-router'
import { Button } from '@mui/material'

const useRouteMatch = (patterns: readonly string[]) => {
    const { pathname } = useLocation()

    for (let i = 0; i < patterns.length; i += 1) {
        const pattern = patterns[i]
        if (!pattern) return
        const possibleMatch = matchPath(pattern, pathname)
        if (possibleMatch !== null) {
            return possibleMatch
        }
    }

    return null
}

const TabsRouter = ({openTaskDrawer}: {openTaskDrawer: () => void}) => {
    const routeMatch = useRouteMatch(['/issues', '/boards', '/'])
    const currentTab = routeMatch?.pattern?.path === '/' ? '/issues' : routeMatch?.pattern?.path

    return (
        <div className="w-full flex justify-between">
            <Tabs variant="scrollable" value={currentTab}>
                <Tab label="Все задачи" value="/issues" to="/issues" component={Link} />
                <Tab label="Проекты" value="/boards" to="/boards" component={Link} />
            </Tabs>
            <Button size='small' variant="outlined" onClick={openTaskDrawer}>Создать задачу</Button>
        </div>
    )
}

export default TabsRouter