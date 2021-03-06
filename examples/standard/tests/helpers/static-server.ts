import { promises as fs } from 'fs'
import http from 'http'
import * as path from 'path'

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.svg': 'application/image/svg+xml',
}

type ExtName = keyof typeof mimeTypes

interface Args {
  directory: string
  port: number
  singlePageApp?: boolean
}

export interface ServerObj {
  server: http.Server
  close: () => Promise<void>
}

export default function startStaticServer({ directory, port, singlePageApp }: Args): ServerObj {
  if (!path.isAbsolute(directory)) {
    throw Error(`Provided directory [${directory}] must be an absolute path.`)
  }

  function isForbidden(filePath: string): boolean {
    return !filePath.startsWith(directory)
  }
  const notFoundPath = path.resolve(directory, './404.html')
  const indexPath = path.resolve(directory, 'index.html')

  const server = http
    .createServer(function (request, response): void {
      const url = request.url as string
      let filePath = path.join(directory, url)
      if (isForbidden(filePath)) {
        response.writeHead(403)
        response.end('Access Forbidden')
      }
      if (filePath.endsWith('/')) {
        filePath = filePath + 'index.html'
      }

      const extname = String(path.extname(filePath)).toLowerCase()
      const contentType = mimeTypes[extname as ExtName] || 'application/octet-stream'

      fs.readFile(filePath)
        .then((content): void => {
          response.writeHead(200, { 'Content-Type': contentType })
          response.end(content, 'utf-8')
        })
        .catch((error): void => {
          if (error.code === 'ENOENT') {
            if (singlePageApp) {
              fs.readFile(indexPath)
                .catch(
                  (): string =>
                    'Not Found: you must provide an index.html file when singlePageApp is set to true.'
                )
                .then((content): void => {
                  response.writeHead(200, { 'Content-Type': mimeTypes['.html'] })
                  response.end(content, 'utf-8')
                })
            } else {
              fs.readFile(notFoundPath)
                .catch((): string => 'Not Found')
                .then((content): void => {
                  response.writeHead(404, { 'Content-Type': mimeTypes['.html'] })
                  response.end(content, 'utf-8')
                })
            }
          } else {
            response.writeHead(500)
            response.end('Server Error: ' + error.code + ' ..')
          }
        })
    })
    .listen(port)

  return {
    server,
    close(): Promise<void> {
      return new Promise((resolve, reject): void => {
        server.close((error): void => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
      })
    },
  }
}
