
from googleapiclient.discovery import build
from keys import DEVELOPER_KEY
import json


YOUTUBE_API_SERVICE_NAME = 'youtube'
YOUTUBE_API_VERSION = 'v3'

def youtube_search(options):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
    developerKey=DEVELOPER_KEY)
    search_response = youtube.search().list(
        q=options['term'],
        part=options['part'],
        maxResults=options['max_results'],
        videoCaption='closedCaption',
        type='video'
        ).execute()
    
    listResults=[]
    vid= dict()
    
    for search_result in search_response.get('items', []):
        if search_result['id']['kind'] == 'youtube#video':
            vid['title'] =search_result['snippet']['title']
            vid['id'] =search_result['id']['videoId']
            vid['thumbnail'] =search_result['snippet']['thumbnails']['default']['url']
            vid['description'] =search_result['snippet']['description']
            vid['topic']=options['term']
            listResults.append(vid)
    return(json.dumps(listResults))



 
