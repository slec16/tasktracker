import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react'

type ErrorBoundaryState = {
    hasError: boolean
    error?: Error
}

class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
    constructor(props: PropsWithChildren) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // TODO: Sentry
        console.error('Uncaught error:', error, errorInfo)
    }

    handleReload = () => {
        window.location.reload()
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className='min-h-screen flex flex-col items-center justify-center p-6'>
                    <h1 className='text-2xl font-bold mb-4 text-sky-500 dark:text-orange-500'>Что-то пошло не так</h1>
                    <button
                        className='px-4 py-2 rounded bg-blue-500 dark:bg-orange-500 text-white'
                        onClick={this.handleReload}
                    >
                        Перезагрузить страницу
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary