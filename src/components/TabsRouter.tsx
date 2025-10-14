import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import {
    Link,
    matchPath,
    useLocation,
} from 'react-router'
import { Button } from '@mui/material'
import { useAppDispatch } from '../hooks/redux'
import { openDrawer } from '../store/drawerSlice'

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

const TabsRouter = ({ openTaskDrawer }: { openTaskDrawer: () => void }) => {

    const dispatch = useAppDispatch()

    const handleOpenDrawer = () => {
        dispatch(openDrawer({
            drawerId: null,
            boardId: null
        }))
    }

    const routeMatch = useRouteMatch(['/issues', '/boards', '/board/:id', '/'])

    let currentTab = '/issues'

    if (routeMatch?.pattern?.path) {
        if (routeMatch.pattern.path === '/') {
            currentTab = '/issues'
        } else if (routeMatch.pattern.path === '/board/:id') {
            currentTab = '/boards'
        } else {
            currentTab = routeMatch.pattern.path
        }
    }

    return (
        <div className="w-full flex justify-between">
            <Tabs variant="scrollable" value={currentTab}>
                <Tab label="Все задачи" value="/issues" to="/issues" component={Link} />
                <Tab label="Проекты" value="/boards" to="/boards" component={Link} />
            </Tabs>
            <Button size='small' variant="outlined" onClick={handleOpenDrawer}>Создать задачу</Button>
        </div>
    )
}

export default TabsRouter