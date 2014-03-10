(ns coink.handler
  (:use [compojure.core]
        [hiccup.core]
        [hiccup.page]
        [hiccup.def])
  (:require [compojure.handler :as handler]
            [compojure.route :as route]))

(defhtml application [& body]
  (html5
    [:head
        [:title "Coink: Your Cryptocoin Portfolio"]
        [:meta {:name "description" :content "Cryptocurrency management online"}]
        [:meta {:charset "UTF-8"}]]
    [:body
      [:script "var urlRoot = 'https://api.coink.io';"]
      [:script
        {:data-main "js/main" :src "/js/scripts/require.js"}]
      [:div#coink]]))

(defhtml not-found [& body]
  (html5
    [:h1 "Not Found"]))

(defroutes app-routes
  (GET "/" [] application)
  (route/resources "/")
  (route/not-found not-found))

(def app
  (handler/site app-routes))
