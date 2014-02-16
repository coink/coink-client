(ns coink.handler
  (:use [compojure.core]
        [hiccup.core]
        [hiccup.def])
  (:require [compojure.handler :as handler]
            [compojure.route :as route]))

(defhtml application [& body]
  [:script
    {:data-main "js/main" :src "/js/scripts/require.js"}]
  [:div#coink])

(defhtml not-found [& body]
  [:h1 "Not Found"])

(defroutes app-routes
  (GET "/" [] (application))
  (route/resources "/")
  (route/not-found not-found))

(def app
  (handler/site app-routes))
