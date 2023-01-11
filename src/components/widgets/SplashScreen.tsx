export function SplashScreen(props: {message: string | null}) {
  if (props.message === null) {
    return <></>
  }

  return (
    <div className="aas-splash">
      {props.message}
    </div>
  )
}
