import random, pygame, pygame.locals, heapq, collections
from typing import List


#Crystal formation?

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
CYAN = (0, 255, 255)
WIDTH, HEIGHT = 1000, 1000
pygame.init()
pygame_surface, clock = pygame.display.set_mode((WIDTH, HEIGHT), 0, 32), pygame.time.Clock()
pygame_surface.fill(BLACK)

font1 = pygame.font.get_fonts()
print(font1[0])
font2 = pygame.font.SysFont(font1[0], 14, True)


class Vector2(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        s = "[%s, %s]" % (self.x, self.y)
        return s

    @staticmethod
    def dist(v1, v2):
        # type: (Vector2, Vector2) -> int
        x_dist = abs(v1.x - v2.x)
        y_dist = abs(v1.y - v2.y)
        distance = x_dist**2 + y_dist**2
        return distance

    def add(self, v2, distance):
        # type: (Vector2, int) -> Vector2
        return Vector2(self.x + (v2.x * distance), self.y + (v2.y * distance))

    @staticmethod
    # Given three collinear points p, q, r, the function checks if
    # point q lies on line segment 'pr'
    def on_segment(p, q, r):
        if ((q.x <= max(p.x, r.x)) and (q.x >= min(p.x, r.x)) and
                (q.y <= max(p.y, r.y)) and (q.y >= min(p.y, r.y))):
            return True
        return False

    @staticmethod
    def orientation(p, q, r):
        # to find the orientation of an ordered triplet (p,q,r)
        # function returns the following values:
        # 0 : Collinear points
        # 1 : Clockwise points
        # 2 : Counterclockwise

        # See https://www.geeksforgeeks.org/orientation-3-ordered-points/amp/
        # for details of below formula.

        val = (float(q.y - p.y) * (r.x - q.x)) - (float(q.x - p.x) * (r.y - q.y))
        if (val > 0):

            # Clockwise orientation
            return 1
        elif (val < 0):

            # Counterclockwise orientation
            return 2
        else:

            # Collinear orientation
            return 0

    @staticmethod
    # The main function that returns true if
    # the line segment 'p1q1' and 'p2q2' intersect.
    def do_intersect(v1, v2):
        # Find the 4 orientations required for
        # the general and special cases
        p1, q1 = v1.x, v1.y
        p2, q2 = v2.x, v2.y

        o1 = Vector2.orientation(p1, q1, p2)
        o2 = Vector2.orientation(p1, q1, q2)
        o3 = Vector2.orientation(p2, q2, p1)
        o4 = Vector2.orientation(p2, q2, q1)

        # General case
        if ((o1 != o2) and (o3 != o4)):
            return True

        # Special Cases

        # p1 , q1 and p2 are collinear and p2 lies on segment p1q1
        if ((o1 == 0) and Vector2.on_segment(p1, p2, q1)):
            return True

        # p1 , q1 and q2 are collinear and q2 lies on segment p1q1
        if ((o2 == 0) and Vector2.on_segment(p1, q2, q1)):
            return True

        # p2 , q2 and p1 are collinear and p1 lies on segment p2q2
        if ((o3 == 0) and Vector2.on_segment(p2, p1, q2)):
            return True

        # p2 , q2 and q1 are collinear and q1 lies on segment p2q2
        if ((o4 == 0) and Vector2.on_segment(p2, q1, q2)):
            return True

        # If none of the cases
        return False


class Queue:
    def __init__(self):
        self.elements = collections.deque()

    def empty(self):
        return len(self.elements) == 0

    def put(self, x):
        self.elements.append(x)

    def get(self):
        return self.elements.popleft()


class PriorityQueue:
    def __init__(self):
        self.elements = []

    def empty(self):
        return len(self.elements) == 0

    def put(self, item, priority):
        heapq.heappush(self.elements, (priority, item))

    def get(self):
        return heapq.heappop(self.elements)[1]


class Node(object):
    def __init__(self, position, max_num_connections, name="point", dangerous=False, appealing=False):
        self.position = position  # type: Vector2
        self.min_num_connections, self.max_num_connections = 2, max_num_connections
        self.connections, self.distances = [], []
        self.name = name
        self.dangerous = dangerous
        self.appealing = appealing
        self.parent = False
        self.done = False

    def __lt__(self, other):
        return 0

    def __repr__(self):
        return self.name

    def generate_distance_to_connections(self):
        self.distances = []
        for c in self.connections:
            self.distances.append(Vector2.dist(self.position, c.position))
        # self.connections.sort(key=lambda x: self.distances[self.connections.index(x)])
        # self.distances.sort()

    danger_scalar = 1000
    appealing_scalar = 20

    @staticmethod
    def breadth_first_search(start, goal):
        frontier = Queue()
        frontier.put(start)
        came_from = {start: None}
        while not frontier.empty():
            current = frontier.get()
            # if current == goal:
            #     break
            for next in current.connections:  # TODO: iter sorted(current.connections, key=lambda x: x.dangerous) as an attempt to avoid dangerous nodes?
                if next not in came_from:
                    frontier.put(next)
                    came_from[next] = current
        return came_from

    @staticmethod
    def dijkstra_search(start, goal):
        frontier = PriorityQueue()
        frontier.put(start, 0)
        came_from = {start: None}
        cost_so_far = {start: 0}
        while not frontier.empty():
            current = frontier.get()
            # if current == goal:
            #     break
            # TODO: if found goal, iteratively search the path in reverse and try to find a new path, where the connection to its next node in the found path is cut out, to attempt to find even shorter routes?
            for next in current.connections:
                new_cost = cost_so_far[current] + current.distances[current.connections.index(next)] + (Node.danger_scalar * next.dangerous) - (next.appealing * Node.appealing_scalar)
                if next not in cost_so_far or new_cost < cost_so_far[next]:
                    cost_so_far[next] = new_cost
                    priority = new_cost
                    frontier.put(next, priority)
                    came_from[next] = current
        return came_from, cost_so_far

    @staticmethod
    def a_star_search(start, goal):
        frontier = PriorityQueue()
        frontier.put(start, 0)
        came_from = {start: None}
        cost_so_far = {start: 0}
        while not frontier.empty():
            current = frontier.get()
            # if current == goal:
            #     break
            for next in current.connections:
                new_cost = cost_so_far[current] + current.distances[current.connections.index(next)] + (Node.danger_scalar * next.dangerous) - (next.appealing * Node.appealing_scalar)
                if next not in cost_so_far or new_cost < cost_so_far[next]:
                    cost_so_far[next] = new_cost
                    priority = new_cost + Vector2.dist(goal.position, next.position)
                    frontier.put(next, priority)
                    came_from[next] = current
        return came_from, cost_so_far

    @staticmethod
    def reconstruct_path(came_from, start, goal):
        current = goal
        path = []
        while current != start:
            path.append(current)
            current = came_from[current]
        path.append(start)
        path.reverse()
        return path


def grow_new_graph(num_nodes, max_possible_connections, node_boundary_radius, generation):
    nodes = []  # type: List[Node]
    max_distance = 20
    start_vector = Vector2(num_nodes >> 1, num_nodes >> 1)
    start_node = Node(start_vector, max_possible_connections, "Node %d" % (len(nodes) + 1), False, False)
    new_queue = PriorityQueue()

    def create_random_nodes(parent_node):
        new_nodes = []
        for v in range(max_possible_connections):
            # if random.random() < 0.5: continue  # 50% chance not to make new connection

            random_vector = Vector2((random.random() * 2) - 1, (random.random() * 2) - 1)
            point = parent_node.position.add(random_vector, max_distance)
            new_node = Node(point, max_possible_connections, "Node %d" % (len(nodes) + len(new_nodes) + 1), False, False)
            new_node.new = True
            new_nodes.append(new_node)
        return new_nodes
        # new_node.connections.append(parent_node)
        # new_queue.put(new_node, 0)
        # print(random_vector, point)
        # nodes.append(new_node)

    nodes.append(start_node)
    test1 = create_random_nodes(start_node)
    for n in test1:
        n.connections.append(start_node)
        n.done = True
        start_node.connections.append(n)
        new_queue.put(n, 0)
    nodes.extend(test1)
    # nodes.insert(0, start_node)
    print(nodes)

    start_node.done = True

    for xx in range(100):
        for n in nodes:
            n.new = False
            n.parent = False
        n_parent = new_queue.get()

        for refNode in nodes:  # Hacky way to then get the unadulterated list of nodes element which is furthest away
            if refNode.name == n_parent.name: break
        refNode.parent = True
        refNode.done = True

        test2 = create_random_nodes(n_parent)
        for t in test2:
            t.connections.append(refNode)
            # node_to_connect = refNode
            refNode.connections.append(t)
            new_queue.put(t, len(nodes) + xx + len(test2))
        nodes.extend(test2)
        # (new_queue.put(n, 0) for n in nodes)

        print(nodes)

        # for x in range(10):
        #     n = new_queue.get()
        #     new_n = create_random_nodes(n)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:  done = True
        pygame_surface.fill(BLACK)
        drawing_x_scaler, drawing_y_scaler = int(WIDTH / 100), int(HEIGHT / 100)

        already_rendered = []
        for n in nodes:  # Render the lines between connected nodes
            for c in n.connections:
                first, second = (n, c) if n.position.x + n.position.y < c.position.x + c.position.y else (c, n)
                uid = "%s + %s" % (first.name, second.name)
                if uid not in already_rendered:  # Ensure that connections aren't being re-rendered from their child node
                    distance = Vector2.dist(n.position, c.position)
                    scale = 255 / num_nodes
                    colour = (random.random() * 255, random.random() * 255, random.random() * 255)
                    if not (n.new or c.new): colour = (100, 100, 100)
                    # pygame.draw.line(pygame_surface, (min(distance * scale, 255), min(max((255 - (distance * scale)) * (scale*node_margin), 0), 255), 0), (n.position.x * drawing_x_scaler, n.position.y * drawing_y_scaler), (c.position.x * drawing_x_scaler, c.position.y * drawing_y_scaler), 5)
                    pygame.draw.line(pygame_surface, colour,
                                     (n.position.x * drawing_x_scaler, n.position.y * drawing_y_scaler),
                                     (c.position.x * drawing_x_scaler, c.position.y * drawing_y_scaler), 8)
                    already_rendered.append(uid)
        # for n in nodes:
        #     node_colour = WHITE if not n.parent else CYAN if not n.done else RED
        #     size = 13 if not n.parent else 26
        #     # if n.done:
        #     #     pygame.draw.circle(pygame_surface, RED,
        #     #                        (n.position.x * drawing_x_scaler, n.position.y * drawing_y_scaler),
        #     #                        size + 2, 0)
        #     pygame.draw.circle(pygame_surface, node_colour,
        #                        (n.position.x * drawing_x_scaler, n.position.y * drawing_y_scaler),
        #                        size, 0)
        #     text2 = font2.render(n.name.replace("Node ", ""), True, BLACK)
        #     textRect2 = text2.get_rect()
        #     textRect2.center = (n.position.x * drawing_x_scaler, (n.position.y * drawing_y_scaler))
        #     pygame_surface.blit(text2, textRect2)  # Add the screen text
        #     pygame.display.update()

        pygame.display.update()
        pygame.display.flip()

        pygame.time.delay(1)
    pygame.time.delay(1000)
    grow_new_graph(100, 10, 5, 1)



def generate_new_graph_nodes(num_nodes, max_possible_connections, node_margin, generation, failure_rate=0):
    # num_nodes = 100
    # max_possible_connections = 2
    # node_margin = 7
    nodes = []  # type: List[Node]
    drawing_x_scaler, drawing_y_scaler = int(WIDTH / num_nodes), int(HEIGHT / num_nodes)
    occupied_positions = []
    for n in range(num_nodes):  # Generate x and y positions for nodes
        allocated_ok = False
        while not allocated_ok:  # Ensure that generated nodes are not overlapping position
            pos = Vector2(random.randint(2, num_nodes - 2), random.randint(2, num_nodes - 2))
            overlapping = False
            for o in occupied_positions:
                if o.x == pos.x and o.y == pos.y: overlapping = True
            # if pos not in occupied_positions:  # Calculate pseudo-random number of connections, and generate Node
            if not overlapping:
                rand_max_connection_bias = max_possible_connections - 1
                max_connections = max_possible_connections + random.randint(-rand_max_connection_bias, 1)
                danger = random.randint(0, 100) > 95
                attractive = False
                if not danger:
                    attractive = random.randint(0, 100) > 80
                nodes.append(Node(pos, max_connections, "Node %d" % n, danger, attractive))  # Generate node and store in nodes list
                occupied_positions.append(pos)
                for i in range(-node_margin + 1, node_margin - 1):
                    for j in range(-node_margin + 1, node_margin - 1):
                        occupied_positions.append(Vector2(pos.x + i, pos.y + j))
                allocated_ok = True

    def is_actually_planar():
        planar_list = []
        nodes_by_distance = [x for x in nodes]
        for n in nodes:   # Iterate over every node, and set the furthest away node as a target, then try to reach that node
            # TODO: use dictionary, only take a subset of points??? ~kind risky
            nodes_by_distance.sort(key=lambda s: Vector2.dist(n.position, s.position), reverse=True)
            node_to_connect_dc = nodes_by_distance[0]
            for refNode in nodes:  # Hacky way to then get the unadulterated list of nodes element which is furthest away
                if refNode.name == node_to_connect_dc.name: break
            node_to_connect = refNode
            # Search all nodes and try to pathfind to target node, if we reach the target then move onto next n
            nodes_visited, nodes_to_visit = [], [x for x in n.connections]
            success = False
            for current_node in nodes_to_visit:
                if current_node not in nodes_visited:
                    nodes_visited.append(current_node)
                    if current_node is node_to_connect: success = True; break
                    for c in current_node.connections:
                        if c not in nodes_visited:
                            if c is node_to_connect: success = True; break
                            if c not in nodes_to_visit: nodes_to_visit.append(c)
                    if success: break
            # TODO: if not success, then find the orphaned node-cluster and force a connection to it's nearest node which isn't in node-cluster


            planar_list.append(success)
            if not success: break
        planar = False not in planar_list
        return planar

    def attempt_naive():
        for n in nodes:
            nodes_by_distance = [x for x in nodes if x.name != n.name]
            nodes_by_distance.sort(key=lambda s: Vector2.dist(n.position, s.position), reverse=False)
            nodes_to_connect = nodes_by_distance[:n.max_num_connections]
            # TODO: Check that nodes to connect doesn't exists within a current connection vector
            for nc in nodes_to_connect:
                for refNode in nodes:
                    if refNode.name == nc.name: break
                if refNode is not n:
                    if refNode not in n.connections:
                        n.connections.append(refNode)
                    if n not in refNode.connections:
                        refNode.connections.append(n)

    attempt_naive()  # connect nodes using their closest neighbour
    successful_graph = is_actually_planar()  # check graph is planar
    if not successful_graph: # TODO: Remove this conditional if you want to see the non-planar graphs that are generated
        failure_rate += 1
        print("Fail@ %s, attempt: %s" % (generation, failure_rate))
        return generate_new_graph_nodes(num_nodes, max_possible_connections, node_margin, generation, failure_rate)

    # font2 = pygame.font.Font('freesansbold.ttf', 14)
    already_rendered = []
    for n in nodes:  # Render the lines between connected nodes
        for c in n.connections:
            first, second = (n, c) if n.position.x + n.position.y < c.position.x + c.position.y else (c, n)
            uid = "%s + %s" % (first.name, second.name)
            if uid not in already_rendered:  # Ensure that connections aren't being re-rendered from their child node
                distance = Vector2.dist(n.position, c.position)
                scale = 255 / num_nodes
                # pygame.draw.line(pygame_surface, (min(distance * scale, 255), min(max((255 - (distance * scale)) * (scale*node_margin), 0), 255), 0), (n.position.x * drawing_x_scaler, n.position.y * drawing_y_scaler), (c.position.x * drawing_x_scaler, c.position.y * drawing_y_scaler), 5)
                pygame.draw.line(pygame_surface, (150, 150, 150), (n.position.x * drawing_x_scaler, n.position.y * drawing_y_scaler), (c.position.x * drawing_x_scaler, c.position.y * drawing_y_scaler), 8)
                already_rendered.append(uid)
    for n in nodes:
        node_colour = RED if n.dangerous else WHITE if not n.appealing else GREEN
        pygame.draw.circle(pygame_surface, node_colour, (n.position.x * drawing_x_scaler, n.position.y * drawing_y_scaler), 13, 0)
        text2 = font2.render('%d' % (n.position.x + n.position.y), True, BLACK)
        textRect2 = text2.get_rect()
        textRect2.center = (n.position.x * drawing_x_scaler, (n.position.y * drawing_y_scaler))
        pygame_surface.blit(text2, textRect2)  # Add the screen text
        pygame.display.update()

    return nodes


# grow_new_graph(100, 20, 5, 1)

done, iteration = False, 0
while not done:
    iteration += 1
    for event in pygame.event.get():
        if event.type == pygame.QUIT:  done = True
    pygame_surface.fill(BLACK)
    # 100, 2, 7 is optimal
    node_count, connection_bias, node_padding = 100, 2, 7
    nodes = generate_new_graph_nodes(node_count, connection_bias, node_padding, iteration)
    drawing_x_scaler, drawing_y_scaler = int(WIDTH / node_count), int(HEIGHT / node_count)

    # TODO: path find from top left node to bottom right node, + render out the path
    first_node, last_node = (nodes[0], nodes[-1])
    start_vector, end_vector = Vector2(0, 0), Vector2(node_count - 1, node_count - 1)
    for n in nodes:
        distance_from_start = Vector2.dist(n.position, start_vector)
        if distance_from_start < Vector2.dist(first_node.position, start_vector):
            first_node = n
        distance_from_end = Vector2.dist(n.position, end_vector)
        if distance_from_end < Vector2.dist(last_node.position, end_vector):
            last_node = n
        # TODO: Test the generate distances method sorts the connections appropriately
        n.generate_distance_to_connections()


    # A* in blue on the path
    last_node_on_path, travel_cost = Node.a_star_search(first_node, last_node)
    path = Node.reconstruct_path(last_node_on_path, first_node, last_node)
    for current_node in path:
        if current_node is not path[-1]:
            next_node = path[path.index(current_node) + 1]
            start_pos = (current_node.position.x * drawing_x_scaler, current_node.position.y * drawing_y_scaler)
            end_pos = (next_node.position.x * drawing_x_scaler, next_node.position.y * drawing_y_scaler)
            pygame.draw.line(pygame_surface, (0, 0, 255), start_pos, end_pos, 3)

    # dijkstra in cyan to the right of the path
    last_node_on_path2, travel_cost2 = Node.dijkstra_search(first_node, last_node)
    path2 = Node.reconstruct_path(last_node_on_path2, first_node, last_node)
    for current_node2 in path2:
        if current_node2 is not path2[-1]:
            next_node2 = path2[path2.index(current_node2) + 1]
            start_pos2 = ((current_node2.position.x * drawing_x_scaler) + 20, (current_node2.position.y * drawing_y_scaler) - 20)
            end_pos2 = ((next_node2.position.x * drawing_x_scaler) + 20, (next_node2.position.y * drawing_y_scaler) - 20)
            pygame.draw.line(pygame_surface, (0, 255, 255), start_pos2, end_pos2, 3)

    # breadth in pink to the left of the path
    last_node_on_path3 = Node.breadth_first_search(first_node, last_node)
    path3 = Node.reconstruct_path(last_node_on_path3, first_node, last_node)
    for current_node3 in path3:
        if current_node3 is not path3[-1]:
            next_node3 = path3[path3.index(current_node3) + 1]
            start_pos3 = ((current_node3.position.x * drawing_x_scaler) - 20, (current_node3.position.y * drawing_y_scaler) + 20)
            end_pos3 = ((next_node3.position.x * drawing_x_scaler) - 20, (next_node3.position.y * drawing_y_scaler) + 20)
            pygame.draw.line(pygame_surface, (244, 66, 238), start_pos3, end_pos3, 3)
    pygame.display.update()
    pygame.display.flip()
    pygame.image.save(pygame_surface, "YoHoH_%03d.png" % iteration)  # Saves canvas to .png
    # clock.tick(1)



    pygame.time.delay(3000)
pygame.quit()
