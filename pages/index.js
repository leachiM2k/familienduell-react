import Head from 'next/head'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
          <div id="startDiv" style={{ width: '500px', margin: 'auto' }}>
              <h1 style={{ fontSize: '5em' }}>Familienduell</h1>
              <a href="/display" id="displayBtn" style={{ fontSize: '2em', width: '500px' }}>
                  <i className="fa fa-desktop"></i> DISPLAY
              </a>
              <br/>
              <a href="/controller" id="controllerBtn" style={{ fontSize: '2em', width: '500px', marginTop: '2px' }}>
                  <i className="fa fa-keyboard-o"></i> CONTROLLER
              </a>
          </div>
      </main>
    </div>
  )
}
