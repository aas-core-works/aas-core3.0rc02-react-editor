// SPDX-FileCopyrightText: 2021 aas-core3.0rc02-react-editor AUTHORS
//
// SPDX-License-Identifier: MIT

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
