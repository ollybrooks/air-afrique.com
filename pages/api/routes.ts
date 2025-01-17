import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const pagesDirectory = path.join(process.cwd(), 'pages');
  
  function getRoutes(dir: string, routes: string[] = [], base = ''): string[] {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        getRoutes(filePath, routes, `${base}/${file}`);
      } else {
        const ext = path.extname(file);
        if (['.tsx', '.ts', '.js', '.jsx'].includes(ext)) {
          let route = `${base}/${file.replace(/\.(tsx|ts|js|jsx)$/, '')}`;
          // Clean up the route
          route = route.replace('/index', '/');
          route = route === '/index' ? '/' : route;
          if (!route.includes('/_') && !route.includes('/api/')) {
            routes.push(route);
          }
        }
      }
    });
    
    return routes;
  }

  try {
    const routes = getRoutes(pagesDirectory);
    res.status(200).json({ routes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get routes' });
  }
}