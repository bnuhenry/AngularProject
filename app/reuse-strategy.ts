import { RouteReuseStrategy,DefaultUrlSerializer,ActivatedRouteSnapshot,DetachedRouteHandle } from '@angular/router'

export class ReuseStrategy implements RouteReuseStrategy{

cacheRouters:{[key:string]:any} = {};

//默认对所有路由复用，可通过给路由配置项增加data:{keep:true}来进行选择性使用
//{path:'search',component:SearchComponent,data:{keep:true}}
shouldDetach(route:ActivatedRouteSnapshot):boolean{
    if(!route.data.keep){
        return false;
    }else{
        return true;
    }
}

//用path作key保存路由快照和组件当前实例对象，path等同RouterModule.forRoot中的配置
store(route:ActivatedRouteSnapshot,handle:DetachedRouteHandle):void{
    this.cacheRouters[route.routeConfig.path]={
        snapshot:route,
        handle:handle
    };
}

//缓存中有的都可以复用
shouldAttach(route:ActivatedRouteSnapshot):boolean{
    return !!route.routeConfig && !!this.cacheRouters[route.routeConfig.path];
}

//缓存中获取快照，没有就返回null
retrieve(route:ActivatedRouteSnapshot):DetachedRouteHandle{
    if(!route.routeConfig || route.routeConfig.loadChildren || !this.cacheRouters[route.routeConfig.path]) return null;
    return this.cacheRouters[route.routeConfig.path].handle;
}

//同一路由时复用路由
shouldReuseRoute(future:ActivatedRouteSnapshot,curr:ActivatedRouteSnapshot):boolean{
    return future.routeConfig === curr.routeConfig;
}

}