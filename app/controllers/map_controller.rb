require 'excon'
require 'uri'

# Provides access to the main page with the HUBZone map
class MapController < ApplicationController
  def index
  end

  def search
    query = format_query params
    path = "#{MAP_CONFIG[:hubzone_api_search_path]}?#{query}"
    response = api_get path
    @body = response.data[:body]
    respond_to do |format|
      format.js {}
    end
  end

  def format_query(params)
    query = parse_search_query params
    return query if query.nil?

    # Add in the query date if present
    query += "&" + URI.encode_www_form("query_date" => params[:query_date] ||= ' ') if params[:query_date].present?
    query
  end

  def parse_search_query(params)
    if params[:search].present?
      URI.encode_www_form("q" => params[:search] ||= ' ')
    elsif params[:latlng].present?
      URI.encode_www_form("latlng" => params[:latlng] ||= ' ')
    end
  end

  private

  def api_get(path)
    version = MAP_CONFIG[:hubzone_api_version]
    connection.request(method: :get,
                       path: path,
                       headers: { 'Accept' => "application/sba.hubzone-api.v#{version}" })
  end

  def connection
    @connection ||= Excon.new(MAP_CONFIG[:hubzone_api_host])
  end
end
