import urllib.request as url_request
from bs4 import BeautifulSoup as Soup
from pymongo import UpdateOne, MongoClient as mc
from secret import get_secret

connect_string = get_secret()


class SneakyURLopener(url_request.FancyURLopener):
    version = "Mozilla/5.0"


def get_element(parent, el, attributes, i=0):
    container = parent.find_all(el, attributes)
    if len(container) > 0:
        return container[i]
    print('Failed to find element.\nel: %s\nattributes: %s' % (el, attributes))
    return None


def insert_docs(db_name, col_name, docs):
    client = mc(get_secret())
    db = client.get_database(db_name)
    col = db[col_name]
    col.insert_many(docs)


def insert_new_docs(db_name, col_name, docs):
    client = mc(get_secret())
    db = client.get_database(db_name)
    col = db[col_name]
    requests = []

    for doc in docs:
        thread_filter = {"thread_num": doc['thread_num']}
        requests.append(UpdateOne(thread_filter, {'$set': doc}, upsert=True))

    col.bulk_write(requests)


def replace_docs(db_name, col_name, docs):
    client = mc(get_secret())
    db = client.get_database(db_name)
    col = db[col_name]

    for doc in docs:
        thread_filter = {"thread_num": doc['thread_num']}
        col.find_one_and_replace(thread_filter, doc, upsert=True)


def wipe_col(db_name, col_name):
    client = mc(get_secret())
    db = client.get_database(db_name)
    col = db[col_name]
    col.delete_many({})


def write_soup(filename, content):
    f = open(filename, "w", encoding='utf-8')
    f.write(content.prettify())
    f.close()


def write_file(filename, content):
    f = open(filename, "w", encoding='utf-8')
    f.write(content)
    f.close()


def get_soup(url):
    url_opener = SneakyURLopener()
    url_client = url_opener.open(url)
    page_html = url_client.read()
    url_client.close()
    return Soup(page_html, "html.parser")


def get_thread_infos(url, pages):
    """
    :param url: url to start crawling at. Ie 'https://www.pathofexile.com/forum/view-forum/patch-notes'
    :param crawl_all: if True, then crawl the entire forum section, else only crawl the first page

    :return: list of {url, title, post date, author} for threads
    """
    result = []

    for i in range(min(pages, page_count(url))):
        page_soup = get_soup('%s/page/%d' % (url, i+1))
        thread_container = page_soup.tbody.findAll("tr")
        for thread in thread_container:
            title_container = get_element(thread, "div", {"class": "title"})
            title = title_container.a.text.strip()
            href = 'https://www.pathofexile.com' + title_container.a['href']
            post_date = get_element(
                thread, 'span', {'class': 'post_date'}).text.strip(',')
            author = get_element(
                thread, 'span', {'class': 'profile-link'}).a.text
            result.append((href, title, post_date, author))

    return result


def page_count(url):
    """
    Helper function for get_thread_infos. Finds total pages in the forum
    """
    page_soup = get_soup(url)
    controls_div = get_element(
        page_soup, 'div', {'class': 'botBar last forumControls'})
    page_as = controls_div.findAll('a')

    try:
        pages = int(page_as[-2].text)
        return pages
    except ValueError:
        print(page_as[-2] + " is not an integer.")
        return 0


def parse_doc_from_thread(url, title, post_date, author):
    '''
    Creates a doc to be inserted into one of the collections in threads_db
    '''
    page_soup = get_soup(url)
    content = get_element(page_soup, "tr", {})

    # redirect profile URLs to pathofexile.com in formatted HTML
    profile_span = get_element(content, "span", {"class": "profile-link"})
    if profile_span:
        profile_a = profile_span.a
        new_a = page_soup.new_tag(
            "a", href="https://www.pathofexile.com" + profile_a['href'])
        new_a.string = profile_a.text
        profile_a.replace_with(new_a)

    thread_num = url.split('/')[-1].strip()
    html = content.prettify().replace('<br>', '').replace('</br>', '')

    return {'thread_num': thread_num,
            'title': title,
            'html': html,
            'text': content.text,
            'post_date': post_date,
            'author': author}


def crawl_forums(forum_names, pages):
    '''
    Intended for running in the background every X minutes using a cronjob.
    '''
    # wipe_col('thread_db', 'testing_zone')
    for forum_name in forum_names:
        forum_url = 'https://www.pathofexile.com/forum/view-forum/' + forum_name
        thread_infos = get_thread_infos(forum_url, pages)
        docs = []

        for url, title, post_date, author in thread_infos:
            docs.append(parse_doc_from_thread(url, title, post_date, author))

        insert_new_docs(
            'thread_db', forum_name, docs)


def main():
    crawl_forums(['patch-notes', 'news'], 1)


if __name__ == "__main__":
    main()
