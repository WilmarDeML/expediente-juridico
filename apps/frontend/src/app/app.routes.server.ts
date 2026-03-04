import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
	{
		path: 'expedientes/:id',
		renderMode: RenderMode.Server,
	},
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
