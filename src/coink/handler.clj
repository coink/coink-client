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
        [:meta {:name "description" :content "Breathe insight into your crypto-holdings"}]
        [:meta {:name "viewport" :content "width=device-width, initial-scale=1.0"}]
        [:meta {:charset "UTF-8"}]]
        [:link {:rel "stylesheet" :href "/css/styles.css"}]
    [:body
      (comment [:script "var urlRoot = 'https://api.coink.io';"])
      [:script "var urlRoot = 'http://private-d789-coink.apiary.io'"]
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
